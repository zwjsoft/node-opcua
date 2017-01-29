const _FIRST_INTERNAL_ID = 0xFFFE0000;

let _nextAvailableId = _FIRST_INTERNAL_ID;

function generateNewId() {
    _nextAvailableId += 1;
    return _nextAvailableId;
}

function nextAvailableId() {
    return -1;
}

function isInternalId(value) {
    return value >= _FIRST_INTERNAL_ID;
}

export {
    generateNewId,
    nextAvailableId,
    isInternalId
};