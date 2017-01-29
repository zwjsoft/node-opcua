require("requirish")._(module);
// --------- This code has been automatically generated !!! Wed Apr 29 2015 20:52:17 GMT+0200 (Paris, Madrid (heure d�t�))
/**
 * @module opcua.address_space.types
 */
var assert = require("better-assert");
var util = require("util");
var _ = require("underscore");
var makeNodeId = require("lib/datamodel/nodeid").makeNodeId;
var schema_helpers = require("lib/misc/factories_schema_helpers");
var extractAllFields = schema_helpers.extractAllFields;
var resolveSchemaFieldTypes = schema_helpers.resolveSchemaFieldTypes;
var initializeField = schema_helpers.initializeField;
var initializeField_array = schema_helpers.initializeField_array;
var checkOptionsCorrectnessAgainstSchema = schema_helpers.checkOptionsCorrectnessAgainstSchema;
var _defaultTypeMap = require("lib/misc/factories_builtin_types")._defaultTypeMap;
var ec = require("lib/misc/encode_decode");
var encodeArray = ec.encodeArray;
var decodeArray = ec.decodeArray;
var makeExpandedNodeId = ec.makeExpandedNodeId;
var generateNewId = require("lib/misc/factoryIdGenerator").generateNewId;
var _enumerations = require("lib/misc/factories_enumerations")._private._enumerations;
var schema = require("schemas/Variant_schema").Variant_Schema;
var BaseUAObject = require("lib/misc/factories_baseobject").BaseUAObject;

//## Define special behavior for Enumeration
var _enum_properties = {
    "dataType": {
        hidden: false,
        enumerable: true,
        configurable: true,
        get: function () {
            return this.__dataType;
        },
        set: function (value) {
            var coercedValue = _enumerations.DataType.typedEnum.get(value);
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
    },
    "arrayType": {
        hidden: false,
        enumerable: true,
        configurable: true,
        get: function () {
            return this.__arrayType;
        },
        set: function (value) {
            var coercedValue = _enumerations.VariantArrayType.typedEnum.get(value);
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
    },
};


/**
 *
 * @class Variant
 * @constructor
 * @extends BaseUAObject
 * @param  options {Object}
 * @param  [ options.dataType = 0] {DataType} the variant type.
 * @param  [ options.arrayType = 0] {VariantArrayType}
 * @param  [ options.value = null] {Any}
 */
function Variant(options) {
    options = options || {};
    checkOptionsCorrectnessAgainstSchema(this, schema, options);
    var self = this;
    assert(this instanceof BaseUAObject); //  ' keyword "new" is required for constructor call')
    resolveSchemaFieldTypes(schema);

    //construction hook
    options = schema.construct_hook(options);
    BaseUAObject.call(this, options);

    //define enumeration properties
    Object.defineProperties(this, _enum_properties);

    /**
     * the variant type.
     * @property dataType
     * @type {DataType}
     * @default  0
     */
    self.dataType = initializeField(schema.fields[0], options.dataType);

    /**
     *
     * @property arrayType
     * @type {VariantArrayType}
     * @default  0
     */
    self.arrayType = initializeField(schema.fields[1], options.arrayType);

    /**
     *
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

var encodeDataType = _enumerations.DataType.encode;
var decode_DataType = _enumerations.DataType.decode;
var encode_VariantArrayType = _enumerations.VariantArrayType.encode;
var decode_VariantArrayType = _enumerations.VariantArrayType.decode;
var encode_Any = _defaultTypeMap.Any.encode;
var decodeAny = _defaultTypeMap.Any.decode;
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
//xx var register_class_definition = require("lib/misc/factories_factories").register_class_definition;
//xx register_class_definition("Variant",Variant);
