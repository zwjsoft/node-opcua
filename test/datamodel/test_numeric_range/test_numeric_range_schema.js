import {nextAvailableId} from "lib/misc/factoryIdGenerator";

const ObjWithNumericRange_Schema = {

    id: nextAvailableId(),
    name: "ObjWithNumericRange",
    fields: [
        {name: "title", fieldType: "UAString"},
        {
            name: "numericRange",
            fieldType: "NumericRange"
        }
    ]
};
export { ObjWithNumericRange_Schema };
