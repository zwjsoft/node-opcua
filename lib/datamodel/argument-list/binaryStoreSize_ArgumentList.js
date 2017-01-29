
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
import encode_ArgumentList from './encode_ArgumentList';


function myfindBuiltInType(dataType) {
    return findBuiltInType(dataType.key);
}

const debugLog = make_debugLog(__filename);
const doDebug = checkDebugFlag(__filename);



const binaryStoreSize_ArgumentList = (description, args) => {
    assert(_.isArray(description));
    assert(_.isArray(args));
    assert(args.length === description.length);

    const stream = new BinaryStreamSizeCalculator();
    encode_ArgumentList(description, args, stream);
    return stream.length;
};




export default binaryStoreSize_ArgumentList;
