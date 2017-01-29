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
import DataValue from "lib/datamodel/DataValue";
import { DataType } from "lib/datamodel/variant";
import { StatusCodes } from "lib/datamodel/opcua_status_code";
import AttributeIds from "lib/datamodel/attribute-ids/AttributeIds";
import AttributeNameById from "lib/datamodel/attribute-ids/AttributeNameById";
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
const ReferenceType = null;
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


function nodeIdInfo(addressSpace, nodeId) {
    const obj = addressSpace.findNode(nodeId);
    const name = obj ? obj.browseName.toString() : " <????>";
    return `${nodeId.toString()} [ ${name} ]`;
}

export default nodeIdInfo;
