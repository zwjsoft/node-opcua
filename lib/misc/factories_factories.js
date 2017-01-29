/**
 * @module opcua.miscellaneous
 * @class Factory
 * @static
 */
import assert from "better-assert";
import _ from "underscore";

const _globalFactories = {};

function getFactory(typeName) {
    return _globalFactories[typeName];
}

const registerFactory = (typeName, constructor) => {
    /* istanbul ignore next */
    if (getFactory(typeName)) {
        throw new Error(` registerFactory  : ${typeName} already registered`);
    }
    _globalFactories[typeName] = constructor;
};

/* istanbul ignore next */
function dump() {
    console.log(" dumping registered factories");
    Object.keys(_globalFactories).sort().forEach((e) => {
        console.log(" Factory ", e);
    });
    console.log(" done");
}

function callConstructor(constructor) {
    assert(_.isFunction(constructor));
    const FactoryFunction = constructor.bind(...arguments);
    return new FactoryFunction();
}

const getConstructor = (expandedId) => {
    if (!(expandedId && (expandedId.value in constructorMap))) {
        console.log("#getConstructor : cannot find constructor for expandedId ".red.bold, expandedId.toString());
        return null;
    }
    return constructorMap[expandedId.value];
};

function hasConstructor(expandedId) {
    if (!expandedId) {
        return false;
    }
    assert(expandedId.hasOwnProperty("value"));
    // only namespace 0 can be in constructorMap
    if (expandedId.namespace !== 0) {
        return false;
    }
    return !!constructorMap[expandedId.value];
}

function constructObject(expandedNodeId) {
    const constructor = getConstructor(expandedNodeId);
    if (!constructor) {
        return null;
    }
    return callConstructor(constructor);
}

let constructorMap = {};
function registerClassDefinition(className, classConstructor) {

    registerFactory(className, classConstructor);

    const expandedNodeId = classConstructor.encodingDefaultBinary;

    /* istanbul ignore next */
    if (expandedNodeId.value in constructorMap) {
        throw new Error(` Class ${className} with ID ${expandedNodeId}  already in constructorMap for  ${constructorMap[expandedNodeId.value].name}`);
    }
    constructorMap[expandedNodeId.value] = classConstructor;
}

export {
    getFactory,
    registerClassDefinition,
    dump,
    callConstructor,
    getConstructor,
    hasConstructor,
    constructObject
};
