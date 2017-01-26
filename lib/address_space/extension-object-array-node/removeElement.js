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




function removeElement(arr,elementIndex) {
  const addressSpace = arr.addressSpace;
  const _array = arr.readValue().value.value;
  if (_.isNumber(elementIndex)) {
    assert(elementIndex >= 0 && elementIndex < _array.length);
  } else {
        // find element by name
        // var browseNameToFind = arr.$$getElementBrowseName(elementIndex);
    const browseNameToFind = elementIndex.browseName.toString();

    elementIndex = _array.findIndex((obj, i) => {
      const browseName = arr.$$getElementBrowseName(obj);
      return (browseName === browseNameToFind);
    });
    if (elementIndex < 0) {
      throw new Error(` cannot find element matching ${browseNameToFind.toString()}`);
    }
  }
  const extObj = _array[elementIndex];
  const browseName = arr.$$getElementBrowseName(extObj);

    // remove element from global array (inefficient)
  _array.splice(elementIndex,1);

    // remove matching component

  const nodeId = 0;
  const node = arr.getComponentByName(browseName);

  if (!node) {
    throw new Error(" cannot find component ");
  }

  addressSpace.deleteNode(node.nodeId);
}
export default removeElement;
