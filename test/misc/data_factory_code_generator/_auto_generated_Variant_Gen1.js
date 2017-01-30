require("requirish")._(module);
// --------- This code has been automatically generated !!! Sat Mar 21 2015 21:52:41 GMT+0100 (Paris, Madrid)
/**
 * @module opcua.address_space.types
 */
const assert = require("better-assert");
const util = require("util");
const _ = require("underscore");
const makeNodeId = require("lib/datamodel/NodeId").makeNodeId;
const schema_helpers = require("lib/misc/factories_schema_helpers");
const extractAllFields = schema_helpers.extractAllFields;
const resolveSchemaFieldTypes = schema_helpers.resolveSchemaFieldTypes;
const initializeField = schema_helpers.initializeField;
const initializeField_array = schema_helpers.initializeFieldArray;
const checkOptionsCorrectnessAgainstSchema = schema_helpers.checkOptionsCorrectnessAgainstSchema;
const _defaultTypeMap = require("lib/misc/factories_builtin_types")._defaultTypeMap;
const ec = require("lib/misc/encode_decode");
const encodeArray = ec.encodeArray;
const decodeArray = ec.decodeArray;
const makeExpandedNodeId = ec.makeExpandedNodeId;
const generateNewId = require("lib/misc/factoryIdGenerator").generateNewId;
const _enumerations = require("lib/misc/factories_enumerations")._private._enumerations;
const schema = require("schemas/Variant_schema").Variant_Schema;
const BaseUAObject = require("lib/misc/factories_baseobject").BaseUAObject;

/**
 * @class Variant
 * @constructor
 * @extends BaseUAObject
 */
function Variant(options) {
    options = options || {};
    checkOptionsCorrectnessAgainstSchema(this, schema, options);
    const self = this;
    assert(this instanceof BaseUAObject); //  ' keyword "new" is required for constructor call')
    resolveSchemaFieldTypes(schema);

    //construction hook
    options = schema.construct_hook(options);
    BaseUAObject.call(this, options);

    /**
     * the Variant type.
     * @property dataType
     * @type {DataType}
     * @default  0
     */
        //## Define special behavior for Enumeration
    Object.defineProperties(this, {
        "dataType": {
            hidden: false,
            enumerable: true,
            configurable: true,
            get: function () {
                return this.__dataType;
            },
            set: function (value) {
                const coercedValue = _enumerations.DataType.typedEnum.get(value);
                if (coercedValue === undefined || coercedValue === null) {
                    throw new Error("value cannot be coerced to DataType: " + value);
                }
                this.__dataType = coercedValue;
            }
        },
        "__dataType": {
            hidden: true,
            writable: true,
            enumerable: false
        }
    });
    self.dataType = initializeField(schema.fields[0], options.dataType);

    /**
     * @property arrayType
     * @type {VariantArrayType}
     * @default  0
     */
        //## Define special behavior for Enumeration
    Object.defineProperties(this, {
        "arrayType": {
            hidden: false,
            enumerable: true,
            configurable: true,
            get: function () {
                return this.__arrayType;
            },
            set: function (value) {
                const coercedValue = _enumerations.VariantArrayType.typedEnum.get(value);
                if (coercedValue === undefined || coercedValue === null) {
                    throw new Error("value cannot be coerced to VariantArrayType: " + value);
                }
                this.__arrayType = coercedValue;
            }
        },
        "__arrayType": {
            hidden: true,
            writable: true,
            enumerable: false
        }
    });
    self.arrayType = initializeField(schema.fields[1], options.arrayType);

    /**
     * @property value
     * @type {Any}
     * @default  null
     */
    self.value = initializeField(schema.fields[2], options.value);

    // Object.preventExtensions(self);
}
util.inherits(Variant, BaseUAObject);
schema.id = generateNewId();
Variant.prototype.encodingDefaultBinary = makeExpandedNodeId(schema.id);
Variant.prototype._schema = schema;

const encodeDataType = _enumerations.DataType.encode;
const decode_DataType = _enumerations.DataType.decode;
const encode_VariantArrayType = _enumerations.VariantArrayType.encode;
const decode_VariantArrayType = _enumerations.VariantArrayType.decode;
const encode_Any = _defaultTypeMap.Any.encode;
const decodeAny = _defaultTypeMap.Any.decode;
Variant.prototype.encode = function (stream, options) {
    schema.encode(this, stream, options);
};
/**
 * decode the object from a binary stream
 * @method decode
 *
 * @param stream {BinaryStream}
 * @param [option] {object}
 */
Variant.prototype.decode = function (stream, options) {
    schema.decode(this, stream, options);
};
Variant.prototype.decode_debug = function (stream, options) {
    schema.decode_debug(this, stream, options);
};
/**
 *
 * verify that all object attributes values are valid according to schema
 * @method isValid
 * @return {Boolean}
 */
Variant.prototype.isValid = function () {
    return schema.isValid(this);
};
Variant.possibleFields = function () {
    return [
        "dataType",
        "arrayType",
        "value"
    ];
}();


exports.Variant = Variant;
//const register_class_definition = require("lib/misc/factories_factories").register_class_definition;
//register_class_definition("Variant",Variant);
