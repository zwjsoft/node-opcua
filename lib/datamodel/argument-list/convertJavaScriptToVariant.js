
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





function convertJavaScriptToVariant(argumentDefinition, values) {
    assert(argumentDefinition.length === values.length);
    assert(_.isArray(argumentDefinition));
    assert(_.isArray(values));

    return _.zip(values, argumentDefinition).map((pair) => {
        const value = pair[0];
        const arg = pair[1];
        const variant = _.extend({}, arg);
        variant.value = value;
        return new Variant(variant);
    });
}
export default convertJavaScriptToVariant;
