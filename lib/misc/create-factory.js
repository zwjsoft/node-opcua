/**
 * @module opcua.miscellaneous
 * @class Factory
 * @static
 */

import assert from "better-assert";
import path from "path";
import dirName from './dirName';
import { produceCode } from "lib/misc/factory_code_generator";
import { getClassJavascriptFilename, requireClass } from "lib/misc/factory_code_generator";
import { make_debugLog, checkDebugFlag, normalizeRequireFile } from "lib/misc/utils";

/**
 * create a new object type from a schema
 * @method createObject
 * @param schema {string|Object}
 * @param optionalFolder {String}
 * @param postFix {String}
 *
 */
function createObject(schema, optionalFolder, postFix) {

    //xx console.log(`createObject  schema= ${JSON.stringify(schema)} optionalFolder= ${optionalFolder}, postFix= ${postFix}`);

    const myDir = `${dirName}/lib/misc`;

    let createdSchema, schemaFile, schemaName;

    if (typeof schema === "string") {
        const schemaHints = schema.split("|");
        if (schemaHints.length === 1) {
            schemaHints.unshift("schemas");
        }
        const folderHint = path.join("../..", schemaHints[0]);
        const mySchema = schemaHints[1];
        schemaName = `${mySchema}_Schema`;
        //
        schemaFile = path.normalize(path.join(myDir, folderHint, `${mySchema}_schema.js`));
        //xx const localSchemaFile = normalizeRequireFile('../../', schemaFile);

        createdSchema = require(schemaFile)[schemaName];

    } else {
        const err = new Error();
        const re = /.*\((.*):[0-9]*:[0-9]*\)/g;
        schemaFile = re.exec(err.stack.split("\n")[2])[1];
        if (postFix) {
            schemaFile = schemaFile.replace(".js", `${postFix}.js`);
        }
        if (!optionalFolder) {
            console.log(" MIGRATED OLD SCHEME FILE ".red, schema, schemaFile);
        }
        createdSchema = schema;
    }

    assert(createdSchema.generateSource === undefined);

    schemaName = `${createdSchema.name}_Schema`;

    const generatedSourceFile = getClassJavascriptFilename(createdSchema.name, optionalFolder || "_generated_");

    produceCode(schemaFile, schemaName, generatedSourceFile);

    require(generatedSourceFile)[createdSchema.name];
}


export default createObject;

