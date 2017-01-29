
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


const decode_ArgumentList = (definition, stream) => {
    if (!_.isArray(definition)) {
        throw new Error(
            "This BaseDataType cannot be decoded because it has no definition.\n" +
            "Please construct a BaseDataType({definition : [{dataType: DataType.UInt32 }]});"
        );
    }

    const args = [];
    let value;

    for (let i = 0; i < definition.length; i++) {
        const def = definition[i];

        const decodeFunc = findBuiltInType(def.dataType.key).decode;

        // xx assert(def.valueRank == -1 || def.valueRank==0);
        const isArray = !!((def.valueRank === 1 || def.valueRank === -1));

        if (isArray) {
            value = ec.decodeArray(stream, decodeFunc);
        } else {
            value = decodeFunc(stream);
        }
        args.push(value);
    }
    return args;
};


export default decode_ArgumentList;
