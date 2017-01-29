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
import NodeId from "lib/datamodel/NodeId";


function bindExtObjArrayNode(arr,variableType,indexPropertyName) {
    assert(arr instanceof UAVariable);
    const addressSpace = arr.addressSpace;


    var variableType = addressSpace.findVariableType(variableType);
    assert(!variableType.nodeId.isEmpty());

    let structure = addressSpace.findDataType("Structure");
    assert(structure,"Structure Type not found: please check your nodeset file");

    let dataType = addressSpace.findDataType(variableType.dataType);
    assert(dataType.isSupertypeOf(structure), "expecting a structure (= ExtensionObject) here ");


    arr.$$variableType = variableType;

    structure = addressSpace.findDataType("Structure");
    assert(structure,"Structure Type not found: please check your nodeset file");

    // verify that an object with same doesn't already exist
    dataType = addressSpace.findDataType(variableType.dataType);
    assert(dataType.isSupertypeOf(structure), "expecting a structure (= ExtensionObject) here ");

    arr.$$dataType = dataType;

    arr.$$getElementBrowseName = (extObj) => {
        // assert(extObj.constructor === addressSpace.constructExtensionObject(dataType));
        assert(extObj.hasOwnProperty(indexPropertyName));
        return extObj[indexPropertyName].toString();
    };
    return arr;
}


export default  bindExtObjArrayNode ;
