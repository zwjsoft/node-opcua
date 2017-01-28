/**
 * @module opcua.datamodel
 */
import Enum from "lib/misc/enum";
import assert from "better-assert";
import { registerBasicType } from "lib/misc/factories_basic_type";
import * as ec from "lib/misc/encode_decode";
import { isNullOrUndefined } from "lib/misc/utils";
import accessLevelFlag from "./accessLevelFlag";


// @example
//      makeAccessLevel("CurrentRead | CurrentWrite").should.eql(0x03);
const makeAccessLevel = (str) => {
    let accessFlag;
    if (str === "" || str === 0) {
        accessFlag = accessLevelFlag.get("NONE");
    } else {
        accessFlag = accessLevelFlag.get(str);
    }

    if (isNullOrUndefined(accessFlag)) {
        throw new Error(`Invalid access flag specified '${str}' should be one of ${accessLevelFlag.enums}`);
    }
    return accessFlag;
};


registerBasicType({
    name: "AccessLevelFlag",
    subtype: "Byte",
    defaultValue() {
        return makeAccessLevel("CurrentRead | CurrentWrite");
    },
    encode(value, stream) {
        stream.writeUInt8(value.value & 0xFF);
    },
    decode(stream) {
        const code = stream.readUInt8();
        return accessLevelFlag.get(code || accessLevelFlag.NONE.value);
    },
    coerce(value) {
        return makeAccessLevel(value);
    },
    random() {
        return this.defaultValue();
    }
});

export default makeAccessLevel;
