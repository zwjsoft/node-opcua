/* global describe,it,before*/

import assert from "better-assert";
import UADataType from "lib/address_space/UADataType";
import UAObject from "lib/address_space/UAObject";
import UAVariable from "lib/address_space/UAVariable";
import UAVariableType from "lib/address_space/ua-variable-type/UAVariableType";
import { Variant } from "lib/datamodel/variant";
import { VariantArrayType } from "lib/datamodel/variant";
import Method  from "lib/address_space/UAMethod";
import { StatusCodes } from "lib/datamodel/opcua_status_code";
import { DataType } from "lib/datamodel/variant";
import { AttributeIds } from "lib/services/read_service";
import AddressSpace from "lib/address_space/AddressSpace";
import _ from "underscore";
import { NodeId } from "lib/datamodel/nodeid";
import bindExtObjArrayNode from './bindExtObjArrayNode';

/*
 * define a complex Variable containing a array of extension objects
 * each element of the array is also accessible as a component variable.
 *
 */


/**
 *
 * @method createExtObjArrayNode
 * @param parentFolder
 * @param options
 * @param options.browseName
 * @param options.complexVariableType
 * @param options.variableType
 * @param options.indexPropertyName
 * @return {Object|UAVariable}
 */
function createExtObjArrayNode(parentFolder,options) {
  assert(parentFolder instanceof UAObject);
  assert(typeof options.variableType === "string");
  assert(typeof options.indexPropertyName === "string");

  const addressSpace = parentFolder.addressSpace;

  const complexVariableType = addressSpace.findVariableType(options.complexVariableType);
  assert(!complexVariableType.nodeId.isEmpty());


  const variableType = addressSpace.findVariableType(options.variableType);
  assert(!variableType.nodeId.isEmpty());

  const structure = addressSpace.findDataType("Structure");
  assert(structure,"Structure Type not found: please check your nodeset file");

  const dataType = addressSpace.findDataType(variableType.dataType);
  assert(dataType.isSupertypeOf(structure), "expecting a structure (= ExtensionObject) here ");


  const inner_options = {

    componentOf: parentFolder,

    browseName: options.browseName,
    dataType: dataType.nodeId,
    valueRank: 1,
    typeDefinition: complexVariableType.nodeId,
    value: { dataType: DataType.ExtensionObject, value: [], arrayType: VariantArrayType.Array }
  };

  const variable = addressSpace.addVariable(inner_options);

  bindExtObjArrayNode(variable,options.variableType,options.indexPropertyName);

  return variable;
}

export default createExtObjArrayNode;
