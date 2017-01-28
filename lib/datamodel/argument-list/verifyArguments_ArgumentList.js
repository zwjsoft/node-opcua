
import { findBuiltInType } from "lib/misc/factories";
import * as ec from "lib/misc/encode_decode";
import { Variant } from "lib/datamodel/variant";
import { NodeId } from "lib/datamodel/nodeid";
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

/**
 *
 * @param addressSpace  {AddressSpace}
 * @param argDefinition {Argument}
 * @param arg           {Variant}
 * @return              {Boolean}
 * @private
 */
function isArgumentValid(addressSpace,argDefinition, arg) {
    assert(argDefinition instanceof Argument);
    assert(argDefinition.hasOwnProperty("dataType"));
    assert(argDefinition.hasOwnProperty("valueRank"));
    assert(arg instanceof Variant);

    const argDefDataType = addressSpace.findDataType(argDefinition.dataType);
    const argDataType = addressSpace.findDataType(arg.dataType);

    if (!argDataType) {
        console.log(" cannot find dataType ",arg.dataType);
        return false;
    }
    assert(argDefDataType instanceof UADataType);
    assert(argDataType    instanceof UADataType);

    // istanbul ignore next
    if (doDebug) {
        console.log(" checking argDefDataType ",argDefDataType.toString());
        console.log(" checking argDataType ",argDataType.toString());
    }


    const isArray = (arg.arrayType === VariantArrayType.Array);

    if (argDefinition.valueRank > 0) {
        return isArray;
    } else if (argDefinition.valueRank === -1) { // SCALAR
        if (isArray) {
            return false;
        }
    }

    if (argDataType.nodeId.value === argDefDataType.nodeId.value) {
        return true;
    }

    // check that dataType is of the same type (derived )
    return argDefDataType.isSupertypeOf(argDataType);
}

/**
 *
 * @param addressSpace {AddressSpace}
 * @param methodInputArguments {Argument[]}
 * @param inputArguments       {Variant[]}
 * @return statusCode,inputArgumentResults
 */
function verifyArguments_ArgumentList(addressSpace,methodInputArguments, inputArguments) {
    const inputArgumentResults = [];

    if (methodInputArguments.length > inputArguments.length) {
        // istanbul ignore next
        if (doDebug) {
            console.log(`xxxxxxxx verifyArguments_ArgumentList \n       The client did  specify too many input arguments for the method.  \n        expected : ${methodInputArguments.length}\n        actual   : ${inputArguments.length}`);
        }
        return { statusCode: StatusCodes.BadInvalidArgument };
    }

    if (methodInputArguments.length < inputArguments.length) {
        // istanbul ignore next
        if (doDebug) {
            console.log(`xxxxxxxx verifyArguments_ArgumentList \n        The client did not specify all of the input arguments for the method. \n        expected : ${methodInputArguments.length}\n        actual   : ${inputArguments.length}`);
        }
        return { statusCode: StatusCodes.BadArgumentsMissing };
    }

    let errorCount = 0;
    for (let i = 0; i < methodInputArguments.length; i++) {
        const argDefinition = methodInputArguments[i];

        const arg = inputArguments[i];

        // istanbul ignore next
        if (doDebug) {
            console.log(`xxxxxxxx verifyArguments_ArgumentList checking argument ${i}\n        expected : ${JSON.stringify(argDefinition)}\n        actual:    ${JSON.stringify(arg)}`);
        }
        if (!isArgumentValid(addressSpace,argDefinition, arg)) {
            // istanbul ignore next
            if (doDebug) {
                console.log(`xxxxxxxx verifyArguments_ArgumentList \n         The client did specify a argument with the wrong data type.\n${"          expected : ".white}${argDefinition.dataType}\n${"          actual   :".cyan}${arg.dataType}`);
            }
            inputArgumentResults.push(StatusCodes.BadTypeMismatch);
            errorCount += 1;
        } else {
            inputArgumentResults.push(StatusCodes.Good);
        }
    }
    assert(inputArgumentResults.length === methodInputArguments.length);

    const ret = {
        statusCode: errorCount === 0 ? StatusCodes.Good : StatusCodes.BadInvalidArgument,
        inputArgumentResults
    };

    return ret;
}



export default verifyArguments_ArgumentList;
