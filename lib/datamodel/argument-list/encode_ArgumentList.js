
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


function encode_ArgumentList(definition, args, stream) {
    assert(definition.length === args.length);

    assert(_.isArray(definition));
    assert(_.isArray(args));
    assert(definition.length === args.length);
    assert(definition.length >= 0);

    // we only encode arguments by following the definition

    for (let i = 0; i < definition.length; i++) {
        const def = definition[i];
        const value = args[i];

        const encodeFunc = findBuiltInType(def.dataType.key).encode;

        // xx console.log(" cxxxxxxxxxxc ",def);
        // assert((def.valueRank === -1) || (def.valueRank === 0));

        // todo : handle -3 -2
        const isArray = !!((def.valueRank && (def.valueRank === 1 || def.valueRank !== -1)));

        if (isArray) {
            ec.encodeArray(value, stream, encodeFunc);
        } else {
            encodeFunc(value, stream);
        }
    }
}







export default encode_ArgumentList;
