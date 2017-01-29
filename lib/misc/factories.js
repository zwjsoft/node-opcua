/**
 * @module opcua.miscellaneous
 * @class Factory
 * @static
 */

import assert from "better-assert";
import fs from "fs";
import path from "path";

import {produceCode, getClassJavascriptFilename, requireClass} from "lib/misc/factory_code_generator";
import {registerEnumeration} from "lib/misc/factories_enumerations";
import {make_debugLog, checkDebugFlag, normalizeRequireFile} from "lib/misc/utils";
import {registerBasicType} from "lib/misc/factories_basic_type";
import {
    registerType as registerBuiltInType,
    unregisterType,
    findSimpleType,
    findBuiltInType
} from "lib/misc/factories_builtin_types";
import {constructObject, getFactory} from "lib/misc/factories_factories";

/**
 * register a new object type from a schema
 * @method registerObject
 * @param schema
 * @param optionalFolder {String}
 * @return {Function} the object constructor.
 */
function registerObject(schema, optionalFolder) {
    //xx  let schemaFile;
    if (typeof schema === "string") {
        const schemaName = schema.split("|")[1];
        const schemaRoot = schema.split("|")[0];
        //xx schemaFile = path.join(dirName, `${schemaRoot}/${schemaName}_schema.js`);
        const s = require(`../../${schemaRoot}/${schemaName}_schema.js`);
        schema = s[`${schemaName}_Schema`];
    } else {
        const err = new Error();
        const re = /.*\((.*):[0-9]*:[0-9]*\)/g;
        //xx schemaFile = re.exec(err.stack.split("\n")[2])[1];
    }
    assert(schema.generateSource === undefined);
    const javascriptFilename = getClassJavascriptFilename(schema.name, optionalFolder);
    const generatedSource = path.resolve(path.join(javascriptFilename));
    schema.generateSource = generatedSource;
    //xx const local_generated_source = normalizeRequireFile(dirName, generatedSource);
    return requireClass(schema.name, optionalFolder)[schema.name];
}


function unregisterObject(schema) {
    const generateSource = getClassJavascriptFilename(schema.name);
    if (fs.existsSync(generateSource)) {
        fs.unlinkSync(generateSource);
        assert(!fs.existsSync(generateSource));
    }
}

export {
    registerObject,
    unregisterObject,
    registerEnumeration,
    registerBasicType,
    registerBuiltInType,
    unregisterType,
    findSimpleType,
    findBuiltInType,
    constructObject,
    getFactory
};

