require("requirish")._(module);
import {nextAvailableId} from "lib/misc/factoryIdGenerator";

var ObjWithIntegerId_Schema = {

    id: nextAvailableId(),
    name: "ObjWithIntegerId",
    fields: [
        {name: "title", fieldType: "UAString"},
        {
            name: "requestHandle", fieldType: "IntegerId"
        }
    ]
};
exports.ObjWithIntegerId_Schema = ObjWithIntegerId_Schema;
