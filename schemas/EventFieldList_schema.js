import {nextAvailableId} from "lib/misc/factoryIdGenerator";

const EventFieldList_Schema = {
    id: nextAvailableId(),
    name: "EventFieldList",
    fields: [
        {name: "clientHandle", fieldType: "IntegerId", documentation: "Client-supplied handle for the MonitoredItem"},
        {
            name: "eventFields",
            fieldType: "Variant",
            isArray: true,
            documentation: "List of selected Event fields. This shall be a one to one match with the fields selected in the EventFilter."
        }
    ]
};
export {EventFieldList_Schema};