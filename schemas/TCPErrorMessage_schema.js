import {nextAvailableId} from "lib/misc/factoryIdGenerator";

// TCP Error Message  OPC Unified Architecture, Part 6 page 46
// the server always close the connection after sending the TCPError message

    const TCPErrorMessage_Schema = {
    name: "TCPErrorMessage",
        id: nextAvailableId(),
    fields: [
        { name: "statusCode", fieldType: "StatusCode"},
        { name: "reason", fieldType: "String"} // A more verbose description of the error.
    ]

};
export {TCPErrorMessage_Schema};
