import {nextAvailableId} from "lib/misc/factoryIdGenerator";

const Person2_Schema = {
    id: nextAvailableId(),
    name: "Person2",
    fields: [
        {name: "lastName", fieldType: "UAString"},
        {name: "address", fieldType: "UAString"},
        {name: "age", fieldType: "Int32", defaultValue: 25}
    ]
};

export { Person2_Schema }