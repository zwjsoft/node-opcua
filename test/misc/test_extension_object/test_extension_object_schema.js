import {nextAvailableId} from "lib/misc/factoryIdGenerator";

exports.MetaShapeForUnitTest_Schema = {
    name: "MetaShapeForUnitTest",
    id: nextAvailableId(),
    fields: [
        {name: "name", fieldType: "String"},
        {name: "shape", fieldType: "ExtensionObject"},
        {name: "comment", fieldType: "String"}
    ]
};



var Potato_Schema_Id = 0xF00001;
exports.Potato_Schema = {
    name: "Potato",
    id: Potato_Schema_Id,
    fields: [
        {name: "length", fieldType: "Double"},
        {name: "radius", fieldType: "Double"}

    ]
};
