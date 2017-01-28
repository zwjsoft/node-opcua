
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
import { Argument } from "_generated_/_auto_generated_Argument";
import { 
  make_debugLog,
  checkDebugFlag
} from "lib/misc/utils";
import { BinaryStreamSizeCalculator } from "lib/misc/binaryStream";



export default Argument;
