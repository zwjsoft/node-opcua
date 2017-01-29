
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

import getMethodDeclaration_ArgumentList from "./getMethodDeclaration_ArgumentList";

const debugLog = make_debugLog(__filename);
const doDebug = checkDebugFlag(__filename);


function build_retrieveInputArgumentsDefinition(addressSpace) {
    const the_address_space = addressSpace;
    return (objectId, methodId) => {
        const response = getMethodDeclaration_ArgumentList(the_address_space, objectId, methodId);

        /* istanbul ignore next */
        if (response.statusCode !== StatusCodes.Good) {
            console.log(` StatusCode  = ${response.statusCode.toString()}`);
            throw new Error(`Invalid Method ${response.statusCode.toString()}ObjectId= ${objectId.toString()}Method Id =${methodId.toString()}`);
        }
        const methodDeclaration = response.methodDeclaration;
        // verify input Parameters
        const methodInputArguments = methodDeclaration.getInputArguments();
        assert(_.isArray(methodInputArguments));
        return methodInputArguments;
    };
}

export default build_retrieveInputArgumentsDefinition;
  