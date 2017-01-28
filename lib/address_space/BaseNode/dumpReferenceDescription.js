/* jslint bitwise: true */
/**
 * @module opcua.address_space
 */
require("requirish")._(module);

import util from "util";
import { isNullOrUndefined } from "lib/misc/utils";
import { EventEmitter } from "events";
import { NodeId } from "lib/datamodel/nodeid";
import { makeNodeId } from "lib/datamodel/nodeid";
import { resolveNodeId } from "lib/datamodel/nodeid";
import { coerceQualifyName } from "lib/datamodel/qualified_name";
import { coerceLocalizedText } from "lib/datamodel/localized_text";
import { DataValue } from "lib/datamodel/datavalue";
import { DataType } from "lib/datamodel/variant";
import { StatusCodes } from "lib/datamodel/opcua_status_code";
import { AttributeIds } from "lib/datamodel/attributeIds";
import { AttributeNameById } from "lib/datamodel/attributeIds";
import { ResultMask } from "schemas/ResultMask_enum";
import { NodeClass } from "schemas/NodeClass_enum";
import { 
  BrowseDirection,
  ReferenceDescription,
  makeNodeClassMask
} from "lib/services/browse_service";

import assert from "better-assert";
import _ from "underscore";
import { dumpIf } from "lib/misc/utils";
let ReferenceType = null;
// will be defined after baseNode is defined

import { lowerFirstLetter } from "lib/misc/utils";
import { capitalizeFirstLetter } from "lib/misc/utils";

const doDebug = false;

import Reference from "lib/address_space/Reference";
import { sameNodeId } from "lib/datamodel/nodeid";
import { QualifiedName } from "lib/datamodel/qualified_name";
import {
  _handle_add_reference_change_event  
} from "../address_space_change_event_tools";

import { check_flag } from "lib/misc/utils";

import nodeIdInfo from "./nodeIdInfo";

import referenceTypeToString from "./referenceTypeToString";


function dumpReferenceDescription(addressSpace, referenceDescription) {
  assert(addressSpace.constructor.name === "AddressSpace");
    // assert(addressSpace instanceof AddressSpace);
  assert(referenceDescription.referenceTypeId); // must be known;

  console.log("referenceDescription".red);
  console.log("    referenceTypeId : ", referenceTypeToString(addressSpace, referenceDescription.referenceTypeId));
  console.log("    isForward       : ", referenceDescription.isForward ? "true" : "false");
  console.log("    nodeId          : ", nodeIdInfo(addressSpace, referenceDescription.nodeId));
  console.log("    browseName      : ", referenceDescription.browseName.toString());
  console.log("    nodeClass       : ", referenceDescription.nodeClass.toString());
  console.log("    typeDefinition  : ", nodeIdInfo(addressSpace, referenceDescription.typeDefinition));
}


export default dumpReferenceDescription;
