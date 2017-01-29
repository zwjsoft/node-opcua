import {nextAvailableId} from "lib/misc/factoryIdGenerator";


var FooWithRecursion_Schema = {
    name: "FooWithRecursion",
    documentation: 'A dummy Object.',
    id: nextAvailableId(),

    fields: [
        {name: "name", fieldType: "String"},
        {name: "inner", fieldType: "FooWithRecursion"}
    ]
};
exports.FooWithRecursion_Schema = FooWithRecursion_Schema;
