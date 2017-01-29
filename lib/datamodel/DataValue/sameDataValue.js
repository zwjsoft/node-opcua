import assert from "better-assert";
import _ from "underscore";
import { sameVariant } from "lib/datamodel/variant_tools";
import timestampHasChanged from "./timestampHasChanged";


/**
 *
 * @param v1 {DataValue}
 * @param v2 {DataValue}
 * @param [timestampsToReturn {TimestampsToReturn}]
 * @return {boolean} true if data values are identical
 */
function sameDataValue(v1, v2,timestampsToReturn) {
    if (v1 === v2) {
        return true;
    }
    if (v1 && !v2) {
        return false;
    }
    if (v2 && !v1) {
        return false;
    }
    if (timestampHasChanged(v1,v2,timestampsToReturn)) {
        return false;
    }
    if (v1.statusCode !== v2.statusCode) {
        return false;
    }
    return sameVariant(v1.value, v2.value);
}
export default sameDataValue;
