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


function addElement(options,arr) {
    const addressSpace = arr.addressSpace;

    // verify that arr has been created correctly
    assert(!!arr.$$variableType && !!arr.$$dataType, "did you create the array Node with createExtObjArrayNode ?");

    const obj =  addressSpace.constructExtensionObject(arr.$$dataType,options);

    const browseName = arr.$$getElementBrowseName(obj);

    const elVar = arr.$$variableType.instantiate({
        componentOf: arr.nodeId,
        browseName,
        value: { dataType: DataType.ExtensionObject, value: obj }
    });
    elVar.bindExtensionObject();

    // also add the value inside
    arr._dataValue.value.value.push(obj);
    return elVar;
}

export default addElement;
