/* istanbul ignore next */

/**
 * @module opcua.miscellaneous
 */
import assert from "better-assert";
import fs from "fs";
import path from "path";
import {
    extractAllFields,
    resolveSchemaFieldTypes,
    checkSchemaCorrectness
} from "lib/misc/factories_schema_helpers";
import {getFactory} from "lib/misc/factories_factories";
import _ from "underscore";
import {ObjectIds as objectNodeIds} from "lib/opcua_node_ids";
import * as ec from "lib/misc/encode_decode";
import {
    make_debugLog,
    getTempFilename,
    normalizeRequireFile,
    capitalizeFirstLetter
} from "lib/misc/utils";

import dirName from './dirName';

import {LineFile} from "lib/misc/linefile";

const debugLog = make_debugLog(__filename);


const folderForGeneratedFile = path.normalize(getTempFilename("../_generated_"));

if (fs.existsSync && !fs.existsSync(folderForGeneratedFile)) {
    fs.mkdirSync(folderForGeneratedFile);
}

function requireClass(schemaName, optionalFolder = '_generated_') {
    // have to think about this - see webpack dynamic requires..
    if (optionalFolder === '_generated_') {
        return require(`../../_generated_/_auto_generated_${schemaName}.js`);
    }
    if (optionalFolder === 'tmp') {
        return require(`../../tmp/_auto_generated_${schemaName}.js`);
    }
    // return require(`../../${optional_folder}/_auto_generated_${schema_name}.js`);
}

function getClassJavascriptFilename(schemaName, optionalFolder) {
    let folder = folderForGeneratedFile;
    if (optionalFolder || optionalFolder === "") {
        folder = path.normalize(path.join(process.cwd(), optionalFolder));
    }
    return path.join(folder, `_auto_generated_${schemaName}.js`);
}

function getClassJavascriptFilenameLocal(schemaName) {
    let generateSource = getFactory(schemaName).prototype._schema.generateSource;
    if (!generateSource) {
        generateSource = path.join(folderForGeneratedFile, `_auto_generated_${schemaName}.js`);
    }
    return generateSource;
}

const RUNTIME_GENERATED_ID = -1;


function _writeEnumerationSetter(f, schema, field, member, i) {
    assert(f instanceof LineFile);
    function write(...args) {
        f.write(...args);
    }

    const className = schema.name;
    const capMember = capitalizeFirstLetter(member);
    write(`  set${capMember}(value) {`);
    write(`    var coercedValue = _enumerations.${field.fieldType}.typedEnum.get(value);`);
    write("    /* istanbul ignore next */");
    write("    if (coercedValue === undefined || coercedValue === null) {");
    write(`      throw new Error("value cannot be coerced to ${field.fieldType}: " + value);`);
    write("    }");
    write(`    this.${member} = coercedValue;`);
    write("  };");
}
function _writeEnumeration(f, schema, field, member, i) {
    assert(f instanceof LineFile);
    function write(...args) {
        f.write(...args);
    }

    // xx var __member = "$" + member;

    assert(!field.isArray); // would not work in this case

    const capMember = capitalizeFirstLetter(member);
    write(`    self.set${capMember}(initializeField(schema.fields[${i}], options.${field.name}));`);
}

function _writeComplex(f, schema, field, member/* , i*/) {
    assert(f instanceof LineFile);
    function write(...args) {
        f.write(...args);
    }

    if (field.isArray) {
        if (field.hasOwnProperty("defaultValue")) {
            // todo: fix me => should call field defaultValue in the live version
            write(`    self.${member} = null;`);
        } else {
            write(`    self.${member} = [];`);
        }
        write(`    if (options.${member}) {`);
        write(`        assert(_.isArray(options.${member}));`);
        write(`        self.${member} = options.${member}.map(function(e){ return new ${field.fieldType}(e); } );`);
        write("    }");
    } else if (field.defaultValue === null || field.fieldType === schema.name) {
        write(`    self.${member} = (options.${member}) ? new ${field.fieldType}( options.${member}) : null;`);
    } else {
        write(`    self.${member} =  new ${field.fieldType}( options.${member});`);
    }
}

function _writeBasic(f, schema, field, member, i) {
    assert(f instanceof LineFile);
    function write(...args) {
        f.write(...args);
    }

    assert(field.category === "basic");

    if (field.isArray) {
        write(`    self.${member} = initializeFieldArray(schema.fields[${i}], options.${field.name});`);
    } else {
        write(`    self.${member} = initializeField(schema.fields[${i}], options.${field.name});`);
    }
}


/* eslint complexity:[0,50],  max-statements: [1, 250]*/
function produceCode(schemaFile, schemaName, sourceFile) {
    let isComplexType;
    let i;
    let field;
    let fieldType;
    let member;
    let __member;


    const fullPathToSchema = path.resolve(schemaFile).replace(/\\/g, "/");

    debugLog("\nfullPathToSchema    ".red, fullPathToSchema);

    const relativePathToSchema = normalizeRequireFile(`${dirName}/lib/misc`, fullPathToSchema);
    debugLog("relativePathToSchema".red, relativePathToSchema);

    const localSchemaFile = normalizeRequireFile(path.dirname(sourceFile), fullPathToSchema);
    debugLog("localSchemaFile      ".red, localSchemaFile);
    // const s = require(relative_path_to_schema)
    const truncatedForWebpack = relativePathToSchema.replace('_schema', '');
    const schema = require(`${truncatedForWebpack}_schema.js`)[schemaName];

    checkSchemaCorrectness(schema);

    if (!schema) {
        throw new Error(` Cannot find schema ${schemaName} in ${relativePathToSchema}`);
    }
    const name = schema.name;

    // check the id of the object binary encoding
    let encodingBinaryId = schema.id;
    let encodingXmlId;
    if (!encodingBinaryId) {
        encodingBinaryId = objectNodeIds[`${name}_Encoding_DefaultBinary`];
        encodingXmlId = objectNodeIds[`${name}_Encoding_DefaultXml`];
        // console.log(`encodingBinaryId ${encodingBinaryId}`);
    } else {
        // xx debugLog(schema_file,schema.name, id);
        // xx  assert(id === RUNTIME_GENERATED_ID);
    }

    if (!encodingBinaryId) {
        throw new Error(`${name} has no _Encoding_DefaultBinary id\nplease add a Id field in the structure definition`);
    }


    const encodingBinaryNodeId = (encodingBinaryId === RUNTIME_GENERATED_ID) ? encodingBinaryId : ec.makeExpandedNodeId(encodingBinaryId);
    const encodingXmlNodeId = (encodingXmlId) ? ec.makeExpandedNodeId(encodingXmlId) : null;

    schema.baseType = schema.baseType || "BaseUAObject";
    const baseClass = schema.baseType;
    const className = schema.name;

    const f = new LineFile();

    function write(...args) {
        f.write(...args);
    }

    resolveSchemaFieldTypes(schema);
    const complexTypes = schema.fields.filter(field => field.category === "complex" && field.fieldType !== schema.name);

    const outputFolder = path.dirname(sourceFile);


    // -------------------------------------------------------------------------
    // - insert common require's
    // -------------------------------------------------------------------------
    write("/**");
    write(" * @module opcua.address_space.types");
    write(" */");
    write(`import assert  from "better-assert";`);
    write(`import _  from "underscore";`);
    write(`import { makeNodeId } from "lib/datamodel/NodeId"`);
    write("import {");
    write("  doDebug,");
    write("  extractAllFields,");
    write("  resolveSchemaFieldTypes,");
    write("  initializeField,");
    write("  initializeFieldArray,");
    write("  checkOptionsCorrectnessAgainstSchema");
    write("} from \"lib/misc/factories_schema_helpers\";");
    write("import { _defaultTypeMap } from \"lib/misc/factories_builtin_types\";");
    write("import {encodeArray,decodeArray,makeExpandedNodeId} from \"lib/misc/encode_decode\";");
    write("import { generateNewId } from \"lib/misc/factoryIdGenerator\";");
    write("import {_private} from \"lib/misc/factories_enumerations\";");
    write(`import { registerClassDefinition } from "lib/misc/factories_factories";`);
    // -------------------------------------------------------------------------
    // - insert schema
    // -------------------------------------------------------------------------

    write(`import { ${className}_Schema as schema } from "${localSchemaFile}";`);

    // -------------------------------------------------------------------------
    // - insert definition of complex type used by this class
    // -------------------------------------------------------------------------

    const processedFieldMap = {};
    complexTypes.forEach((field) => {
        const filename = getClassJavascriptFilenameLocal(field.fieldType);
        if (processedFieldMap.hasOwnProperty(filename)) {
            return;
        }
        processedFieldMap[filename] = 1;

        const localFilename = normalizeRequireFile(outputFolder, filename);
        write(`import { ${field.fieldType} } from "${localFilename}";`);
    });

    // -------------------------------------------------------------------------
    // - insert definition of base class
    // -------------------------------------------------------------------------
    write(`import { BaseUAObject } from "lib/misc/factories_baseobject";`);
    if (baseClass !== "BaseUAObject") {
        const filename = getClassJavascriptFilenameLocal(baseClass);

        const localFilename = normalizeRequireFile(outputFolder, filename);
        write(`import { ${baseClass} } from "${localFilename}" ;`);
    }

    function makeFieldType(field) {
        return `{${field.fieldType}${field.isArray ? "[" : ""}${field.isArray ? "]" : ""}}`;
    }

    // -------------------------------------------------------------------------
    // - insert class enumeration properties
    // -------------------------------------------------------------------------
    let hasEnumeration = false;
    let n = schema.fields.length;
    for (i = 0; i < n; i++) {
        if (schema.fields[i].category === "enumeration") {
            hasEnumeration = true;
            break;
        }
    }

    write("const _enumerations = _private._enumerations;");


    //  --------------------------------------------------------------
    //   expose encoder and decoder func for basic type that we need
    //  --------------------------------------------------------------
    write("");
    n = schema.fields.length;
    const done = {};
    for (i = 0; i < n; i++) {
        field = schema.fields[i];
        fieldType = field.fieldType;
        if (!(fieldType in done)) {
            done[fieldType] = field;
            if (field.category === "enumeration") {
                write(`const encode${field.fieldType} = _enumerations.${field.fieldType}.encode;`);
                write(`const decode${field.fieldType} = _enumerations.${field.fieldType}.decode;`);
            } else if (field.category === "complex") {
                //
            } else {
                write(`const encode${field.fieldType} = _defaultTypeMap.${field.fieldType}.encode;`);
                write(`const decode${field.fieldType} = _defaultTypeMap.${field.fieldType}.decode;`);
            }
        }
    }


    if (RUNTIME_GENERATED_ID === encodingBinaryNodeId) {
        write("schema.id = generateNewId();");
    }
    // -------------------------------------------------------------------------
    // - insert class constructor
    // -------------------------------------------------------------------------

    write("");
    write("/**");
    if (schema.documentation) {
        write(` * ${schema.documentation}`);
    }
    write(" * ");
    write(` * @class ${className}`);
    write(" * @constructor");
    write(` * @extends ${baseClass}`);
    // dump parameters

    write(" * @param  options {Object}");
    let def = "";
    for (i = 0; i < n; i++) {
        field = schema.fields[i];
        fieldType = field.fieldType;
        const documentation = field.documentation ? field.documentation : "";
        def = "";
        if (field.defaultValue !== undefined) {
            if (_.isFunction(field.defaultValue)) {
                def = ` = ${field.defaultValue()}`;
            } else {
                def = ` = ${field.defaultValue}`;
            }
        }
        const ft = makeFieldType(field);
        write(` * @param  [options.${field.name}${def}] ${ft} ${documentation}`);
    }

    write(" */");

    write(`class ${className} extends ${baseClass} {`);
    write("  constructor(options){");
    write("    options = options || {};");
    if (baseClass) {
        write(`    super(options);`);
    }
    write("    /* istanbul ignore next */");
    write("    if (doDebug()) { checkOptionsCorrectnessAgainstSchema(this,schema,options); }");
    write("    assert(this instanceof BaseUAObject); //  ' keyword \"new\" is required for constructor call')");
    write("    resolveSchemaFieldTypes(schema);");
    write("");
    if (_.isFunction(schema.construct_hook)) {
        write("    //construction hook");
        write("    options = schema.construct_hook(options); ");
    }
    write("    const self = this;");

    for (i = 0; i < n; i++) {
        field = schema.fields[i];

        fieldType = field.fieldType;

        member = field.name;
        __member = `__${member}`;

        write("");
        write("    /**");
        let documentation = field.documentation ? field.documentation : "";
        write("      * ", documentation);
        write("      * @property ", field.name);
        // write(" _enumerations     * @type ${makeFieldType(field)}`);

        if (field.defaultValue !== undefined) {
            write("      * @default  ", field.defaultValue);
        }

        write("      */");


        if (field.category === "enumeration") {
            _writeEnumeration(f, schema, field, member, i);
        } else if (field.category === "complex") {
            _writeComplex(f, schema, field, member, i);
        } else {
            _writeBasic(f, schema, field, member, i);
        }
    }

    write("   // Object.preventExtensions(self);");
    write("  }");


    // -------------------------------------------------------------------------
    // - Enumeration
    // -------------------------------------------------------------------------
    if (hasEnumeration) {
        write("");
        write("//## Define Enumeration setters");

        for (i = 0; i < n; i++) {
            field = schema.fields[i];
            member = field.name;
            if (field.category === "enumeration") {
                _writeEnumerationSetter(f, schema, field, member, i);
            }
        }
    }


    //  --------------------------------------------------------------
    //   implement encode
    //  ---------------------------------------------------------------
    write("  /**");
    write("   * encode the object into a binary stream");
    write("   * @method encode");
    write("   *");
    write("   * @param stream {BinaryStream} ");
    write("   */");
    if (_.isFunction(schema.encode)) {
        write(` encode(stream) {`);
        write("   schema.encode(this,stream); ");
        write(" };");
    } else {
        write(`  encode(stream) {`);
        write("    // call base class implementation first");
        write(`    super.encode(stream);`);

        n = schema.fields.length;
        for (i = 0; i < n; i++) {
            field = schema.fields[i];
            fieldType = field.fieldType;
            member = field.name;

            if (field.category === "enumeration" || field.category === "basic") {
                if (field.isArray) {
                    write(`    encodeArray(this.${member}, stream, encode${field.fieldType});`);
                } else {
                    write(`    encode${field.fieldType}(this.${member},stream);`);
                }
            } else if (field.category === "complex") {
                if (field.isArray) {
                    write(`    encodeArray(this.${member},stream,function(obj,stream){ obj.encode(stream); }); `);
                } else {
                    write(`   this.${member}.encode(stream);`);
                }
            }
        }
        write("  };");
    }

    //  --------------------------------------------------------------
    //   implement decode
    //  ---------------------------------------------------------------
    write("  /**");
    write("   * decode the object from a binary stream");
    write("   * @method decode");
    write("   *");
    write("   * @param stream {BinaryStream} ");
    write("   */");
    if (_.isFunction(schema.decode)) {
        if (!_.isFunction(schema.decode_debug)) {
            throw new Error(`schema decode requires also to provide a decode_debug ${schema.name}`);
        }
        write(`  decode(stream) {`);
        write("    schema.decode(this,stream); ");
        write("  };");
        write(`  decode_debug(stream,options) {`);
        write("    schema.decode_debug(this,stream,options); ");
        write("  };");
    } else {
        write(`  decode(stream) {`);
        write("    // call base class implementation first");
        write(`    super.decode(stream);`);

        n = schema.fields.length;
        for (i = 0; i < n; i++) {
            field = schema.fields[i];
            fieldType = field.fieldType;
            member = field.name;
            if (field.category === "enumeration" || field.category === "basic") {
                if (field.isArray) {
                    write(`    this.${member} = decodeArray(stream, decode${field.fieldType});`);
                } else if (isComplexType) {
                    write(`    this.${member}.decode(stream);`);
                } else if (_.isFunction(field.decode)) {
                    write(`    this.${member} = schema.fields[${i}].decode(stream);`);
                } else {
                    write(`    this.${member} = decode${field.fieldType}(stream);`);
                }
            } else {
                assert(field.category === "complex");
                if (field.isArray) {
                    write(`    this.${member} = decodeArray(stream, function(stream) { `);
                    write(`       var obj = new ${field.fieldType}();`);
                    write("       obj.decode(stream);");
                    write("       return obj; ");
                    write("    });");
                } else {
                    write(`    this.${member}.decode(stream);`);
                }
            }
        }
        write("  };");
    }

    // ---------------------------------------
    if (_.isFunction(schema.isValid)) {
        write("  /**");
        write("   *");
        write("   * verify that all object attributes values are valid according to schema");
        write("   * @method isValid");
        write("   * @return {Boolean}");
        write("   */");
        write(`  isValid() { return schema.isValid(this); };`);
    }


// -------------------------------------------------------------------------
// - encodingDefaultBinary
// -------------------------------------------------------------------------

    write(`  get encodingDefaultBinary() { return  ${className}.encodingDefaultBinary; }`);


    if (encodingXmlNodeId) {
        write(`  get encodingDefaultXml() { return  ${className}.encodingDefaultXml; }`);
    }

    write(`  get _schema() { return  schema; }`);
    write("}");

    if (RUNTIME_GENERATED_ID === encodingBinaryNodeId) {
        write(`${className}.encodingDefaultBinary = makeExpandedNodeId(schema.id);`)
    } else {
        write(`${className}.encodingDefaultBinary =  makeExpandedNodeId(${encodingBinaryNodeId.value},${encodingBinaryNodeId.namespace});`);
    }
    if (encodingXmlNodeId) {
        write(`${className}.encodingDefaultXml = makeExpandedNodeId(${encodingXmlNodeId.value},${encodingXmlNodeId.namespace});`);
    }


    function quotify(str) {
        return `"${str}"`;
    }

    const possibleFields = extractAllFields(schema);

    write(`${className}.possibleFields = [`);
    write(`  ${possibleFields.map(quotify).join(",\n  ")}`);
    write("];");
    write("\n");


    write(`export { ${className} } ;`);
    write(`registerClassDefinition("${className}",${className});`);
    write(`exports.${className} =  ${className};`);


    f.save(sourceFile);
}

export {
    produceCode,
    folderForGeneratedFile,
    getClassJavascriptFilename,
    requireClass
};
