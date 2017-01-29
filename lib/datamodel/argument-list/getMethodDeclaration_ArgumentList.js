
import { findBuiltInType } from "lib/misc/factories";
import * as ec from "lib/misc/encode_decode";
import { Variant } from "lib/datamodel/variant";
import NodeId from "lib/datamodel/NodeId";
import { StatusCodes } from "lib/datamodel/opcua_status_code";
import { VariantArrayType } from "lib/datamodel/variant";
import UADataType from "lib/address_space/UADataType";
import UAMethod  from "lib/address_space/UAMethod";
import _ from "underscore";
import assert from "better-assert";
import Argument from "./Argument";
import { 
  make_debugLog,
  checkDebugFlag
} from "lib/misc/utils";
import { BinaryStreamSizeCalculator } from "lib/misc/binaryStream";


const debugLog = make_debugLog(__filename);
const doDebug = checkDebugFlag(__filename);





function getMethodDeclaration_ArgumentList(addressSpace, objectId, methodId) {
    assert(objectId instanceof NodeId);
    assert(methodId instanceof NodeId);
    // find object in address space
    const obj = addressSpace.findNode(objectId);
    if (!obj) {
        // istanbul ignore next
        if (doDebug) {
            console.warn("cannot find node ",objectId.toString());
        }
        return { statusCode: StatusCodes.BadNodeIdUnknown };
    }
    if (!obj.hasMethods) {
        return { statusCode: StatusCodes.BadNodeIdInvalid };
    }
    let objectMethod = obj.getMethodById(methodId);
    if (!objectMethod) {
        // the method doesn't belong to the object, nevertheless
        // the method can be called
        objectMethod = addressSpace.findNode(methodId);
        if (!objectMethod || !(objectMethod instanceof UAMethod)) {
            return { statusCode: StatusCodes.BadMethodInvalid };
        }
    }

    const methodDeclarationId = objectMethod.methodDeclarationId;

    const methodDeclaration = addressSpace.findNode(methodDeclarationId);
    if (!methodDeclaration) {
        //  return {statusCode: StatusCodes.BadMethodInvalid};
        return { statusCode: StatusCodes.Good, methodDeclaration: objectMethod };
    }
    return { statusCode: StatusCodes.Good, methodDeclaration };
}

export default getMethodDeclaration_ArgumentList;
