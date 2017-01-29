/**
 * @module opcua.miscellaneous
 */

import _ from "underscore";
import assert from "better-assert";
import { _defaultTypeMap } from "lib/misc/factories_builtin_types";
import { TypeSchema } from "lib/misc/factories_builtin_types";
import { _private } from "lib/misc/factories_enumerations";
import { getFactory } from "lib/misc/factories_factories";
import { make_debugLog } from "lib/misc/utils";
import { display_trace_from_this_projet_only } from "lib/misc/utils";

let _doDebug = !!process.env.DEBUG_CLASS;

const doDebug = () => _doDebug;

const setDebug = (value) => {
    _doDebug = value;
};
const { _enumerations }  = _private;
const debugLog = require("lib/misc/utils").make_debugLog(__filename);

/**
 * ensure correctness of a schema object.
 *
 * @method check_schema_correctness
 * @param schema
 *
 */
function checkSchemaCorrectness(schema) {
    assert(schema.name, " expecting schema to have a name");
    assert(schema.fields, ` expecting schema to provide a set of fields ${schema.name}`);
    assert(schema.baseType === undefined || (typeof schema.baseType === "string"));
}

/**
 *
 * @method getBaseSchema
 * @param schema
 * @return {*}
 *
 */
function getBaseSchema(schema) {
    let baseSchema = schema._baseSchema;
    if (baseSchema) {
        return baseSchema;
    }

    if (schema.baseType && schema.baseType !== "BaseUAObject") {
        const baseType = getFactory(schema.baseType);

        // istanbul ignore next
        if (!baseType) {
            throw new Error(` cannot find factory for ${schema.baseType}`);
        }
        if (baseType.prototype._schema) {
            baseSchema = baseType.prototype._schema;
        }
    }
    // put in  cache for speedup
    schema._baseSchema = baseSchema;

    return baseSchema;
}

/**
 * extract a list of all possible fields for a schema
 * (by walking up the inheritance chain)
 * @method extractAllFields
 *
 */
function extractAllFields(schema) {
    // returns cached result if any
    // istanbul ignore next
    if (schema._possibleFields) {
        return schema._possibleFields;
    }
    // extract the possible fields from the schema.
    let possibleFields = schema.fields.map(field => field.name);

    const baseSchema = getBaseSchema(schema);

    // istanbul ignore next
    if (baseSchema) {
        const fields = extractAllFields(baseSchema);
        possibleFields = fields.concat(possibleFields);
    }

    // put in cache to speed up
    schema._possibleFields = possibleFields;

    return possibleFields;
}

/**
 * check correctness of option fields against scheme
 *
 * @method  checkOptionsCorrectnessAgainstSchema
 *
 */
function checkOptionsCorrectnessAgainstSchema(obj, schema, options) {
    if (!doDebug()) {
        return; // ignoring set
    }

    // istanbul ignore next
    if (!_.isObject(options)) {
        let message = `${" Invalid options specified while trying to construct a ".red.bold} ${schema.name.yellow}`;
        message += " expecting a ".red.bold + " Object ".yellow;
        message += " and got a ".red.bold + (typeof options).yellow + " instead ".red.bold;
        console.error(" Schema  = ", schema);
        console.error(" options = ", options);
        throw new Error(message);
    }

    // istanbul ignore next
    if (options instanceof obj.constructor) {
        return true;
    }

    // extract the possible fields from the schema.
    const possibleFields = obj.constructor.possibleFields;

    // extracts the fields exposed by the option object
    const currentFields = Object.keys(options);


    // get a list of field that are in the 'options' object but not in schema
    const invalidOptionsFields = _.difference(currentFields, possibleFields);

    /* istanbul ignore next */
    if (invalidOptionsFields.length > 0) {
        console.error("expected schema", schema.name);
        console.error("schema", schema);
        console.error("possible_fields", possibleFields);
        display_trace_from_this_projet_only();
        console.error("invalid_options_fields= ", invalidOptionsFields);
    }
    if (invalidOptionsFields.length !== 0) {
        throw new Error(` invalid field found in option :${JSON.stringify(invalidOptionsFields)}`);
    }
    return true;
}


function __fieldCategory(field) {
    if (!field.category) {
        const fieldType = field.fieldType;
        if (_enumerations[fieldType]) {
            field.category = "enumeration";
            field.schema = _enumerations[fieldType];

            assert(field.schema instanceof TypeSchema);
        } else if (getFactory(fieldType)) {
            field.category = "complex";
            field.schema = getFactory(fieldType);
        } else if (_defaultTypeMap[fieldType]) {
            field.category = "basic";
            field.schema = _defaultTypeMap[fieldType];
            assert(field.schema instanceof TypeSchema);
        }
        // istanbul ignore next
        else {
            console.error("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ERROR !".bgRed);
            const err = `Invalid field type : ${fieldType} =( ${JSON.stringify(field)}) is not a default type nor a registered complex struct`;
            console.error(err);
            throw new Error(err);
        }
    }
    return field.category;
}

function resolveSchemaFieldTypes(schema) {
    if (schema.resolved) {
        return;
    }
    schema.fields.forEach((field) => {
        if (field.fieldType === schema.name) {
            // special case for structure recursion
            field.category = "complex";
            field.schema = schema;
        } else {
            __fieldCategory(field);
        }
        assert(field.category);
    });
    schema.resolved = true;
}

/**
 * @method initializeField
 * @param field
 * @param value
 * @return {*}
 */
function initializeField(field, value) {
    const _t = field.schema;
    assert(_t instanceof TypeSchema);
    assert(_.isObject(_t), "expecting a object here ");
    assert(_.isObject(field));
    assert(!field.isArray);

    const defaultValue = _t.computer_default_value(field.defaultValue);

    value = _t.initialize_value(value, defaultValue);

    if (field.validate) {
        if (!field.validate(value)) {
            throw Error(` invalid value ${value} for field ${field.name} of type ${field.fieldType}`);
        }
    }
    return value;
}

// /**
// * Initialize a array of object of a given type.
// * @method initialize_array
// * @param typeName {string} the type name of the objects ( must be in _defaultTypeMap)
// * @param values   {Array[Object] || null} a optional array with the parameters to pass to the object constructor
// * @return {Array[typeName]}
// *
// * @example:
// *
// *
// *
// */
// exports.initialize_array = function(typeName,values) {
//
//    var arr = [];
//
//    if (_.isArray(values)) {
//        var _t = _defaultTypeMap[typeName];
//        var defaultValue = _t.computer_default_value(undefined);
//        values.forEach(function(el){
//            arr.push(_t.initialize_value(el,defaultValue));
//        });
//    }
//    return arr;
//
// };

/**
 * @method initializeFieldArray
 * @param field
 * @param valueArray
 * @return {Array}
 */
function initializeFieldArray(field, valueArray) {
    const _t = field.schema;

    let value;
    let i;
    assert(_.isObject(field));
    assert(field.isArray);

    if (!valueArray && field.defaultValue === null) {
        return null;
    }

    valueArray = valueArray || [];
    const defaultValue = _t.computer_default_value(field.defaultValue);

    const arr = [];
    for (i = 0; i < valueArray.length; i++) {
        value = _t.initialize_value(valueArray[i], defaultValue);
        arr.push(value);
    }
    if (field.validate) {
        for (i = 0; i < arr.length; i++) {
            if (!field.validate(arr[i])) {
                throw Error(` invalid value ${arr[i]} for field ${field.name} of type ${field.fieldType}`);
            }
        }
    }
    return arr;
}

export {
    doDebug,
    setDebug,
    checkSchemaCorrectness,
    getBaseSchema,
    extractAllFields,
    checkOptionsCorrectnessAgainstSchema,
    resolveSchemaFieldTypes,
    initializeField,
    initializeFieldArray
};

