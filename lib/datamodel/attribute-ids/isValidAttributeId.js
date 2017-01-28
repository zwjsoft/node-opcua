import _ from "underscore";
import assert from "better-assert";


function isValidAttributeId(attributeId) {
    assert(_.isFinite(attributeId));
    return attributeId >= 1 && attributeId <= 22;
}
export default isValidAttributeId;
