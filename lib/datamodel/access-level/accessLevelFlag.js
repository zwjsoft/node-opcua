/**
/**
 * @module opcua.datamodel
 */
import Enum from "lib/misc/enum";

// this should really start with lower case..
const accessLevelFlag = new Enum({
    CurrentRead:    0x01,// bit 0 : Indicate if the current value is readable (0 means not readable, 1 means readable).
    CurrentWrite:   0x02,// bit 1 : Indicate if the current value is writable (0 means not writable, 1 means writable).
    HistoryRead:    0x04,// bit 2 : Indicates if the history of the value is readable (0 means not readable, 1 means readable).
    HistoryWrite:   0x08,// bit 3 : Indicates if the history of the value is writable (0 means not writable, 1 means writable).
    SemanticChange: 0x10,// bit 4 : Indicates if the Variable used as Property generates SemanticChangeEvents
    StatusWrite:    0x20,// bit 5 : Indicates if the current StatusCode of the value is writable (0 means not writable, 1 means writable).
    TimestampWrite: 0x40,// bit 6 : Indicates if the current SourceTimestamp of the value is writable (0 means not writable, 1 means writable).
    NONE:           0x800
});


export default accessLevelFlag ;
