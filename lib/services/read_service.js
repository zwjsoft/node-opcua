import AttributeIds from "lib/datamodel/attribute-ids/AttributeIds";
import AttributeNameById from "lib/datamodel/attribute-ids/AttributeNameById";


/**
 * @module services.read
 */
//--------------------------------------------------------------------------------
// OPCUA Part 4 $5.10 : Attribute Service Set
// This Service Set provides Service sto access Attributes that are part of Nodes.
//--------------------------------------------------------------------------------

require("requirish")._(module);
/**
 * @class TimestampsToReturn
 */
exports.TimestampsToReturn = require("schemas/TimestampsToReturn_enum").TimestampsToReturn;
/**
 * @class AttributeIds
 */
exports.AttributeIds = AttributeIds;
/**
 * @class AttributeNameById
 */
exports.AttributeNameById = AttributeNameById;
/**
 * @class ReadValueId
 */
exports.ReadValueId = require("_generated_/_auto_generated_ReadValueId").ReadValueId;
/**
 * @class ReadRequest
 */
exports.ReadRequest = require("_generated_/_auto_generated_ReadRequest").ReadRequest;
/**
 * @class ReadResponse
 */
exports.ReadResponse = require("_generated_/_auto_generated_ReadResponse").ReadResponse;

