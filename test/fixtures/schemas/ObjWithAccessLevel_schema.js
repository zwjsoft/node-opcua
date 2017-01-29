require("requirish")._(module);
import {nextAvailableId} from "lib/misc/factoryIdGenerator";
var ObjWithAccessLevel_Schema = {

    id: nextAvailableId(),
    name: "ObjWithAccessLevel",
    fields: [
        {name: "title", fieldType: "UAString"},
        {
            name: "accessLevel", fieldType: "AccessLevelFlag"
        }
    ]
};
exports.ObjWithAccessLevel_Schema = ObjWithAccessLevel_Schema;
