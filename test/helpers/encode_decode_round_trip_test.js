import _  from "underscore";
import should from "should";
import {BinaryStream} from "lib/misc/binaryStream";
import {constructObject} from "lib/misc/factories_factories";
import {hexDump} from "lib/misc/utils";
import {assert_arrays_are_equal} from "test/helpers/typedarray_helpers";
import {packet_analyzer} from "lib/misc/packet_analyzer";
import {analyze_object_binary_encoding} from "lib/misc/packet_analyzer";

//xx process.argv.push("DEBUG");

function dump_block_in_debug_mode(buffer, id, options) {

    if (process.env.DEBUG) {
        console.log(hexDump(buffer));
        packet_analyzer(buffer, id, 0, 0, options);
    }
}

function isTypedArray(v) {
    return (v && v.buffer && v.buffer instanceof ArrayBuffer);
}

function isArrayOrTypedArray(v) {
    return isTypedArray(v) || v instanceof Array;
}

function compare(reloadedObject, obj) {
    Object.keys(reloadedObject).forEach(function (p) {

        try {
            if (isArrayOrTypedArray(obj[p])) {
                assert_arrays_are_equal(reloadedObject[p], obj[p]);
            } else {
                JSON.stringify(reloadedObject[p]).should.eql(JSON.stringify(obj[p]));
            }
        } catch (err) {
            console.log(" ---------------------------------- error in encodeDecodeRoundTripTest".yellow);
            console.log(" key ".red, p);
            console.log(" expected ".red, JSON.stringify(obj[p]));
            console.log(" actual   ".cyan, JSON.stringify(reloadedObject[p]));
            // re throw exception
            throw err;
        }

    });

}


/**
 *
 * @param obj {Object} : object to test ( the object must provide a binaryStoreSize,encode,decode method
 * @param [options]
 * @param callback_buffer
 * @return {*}
 */
function encodeDecodeRoundTripTest(obj, options, callback_buffer) {

    if (!callback_buffer && _.isFunction(options)) {
        callback_buffer = options;
        options = {};
    }

    callback_buffer = callback_buffer || dump_block_in_debug_mode;

    should.exist(obj);

    const expandedNodeId = obj.encodingDefaultBinary;

    const size = obj.binaryStoreSize(options);

    const stream = new BinaryStream(new Buffer(size));

    obj.encode(stream, options);

    callback_buffer(stream._buffer, obj.encodingDefaultBinary, options);

    stream.rewind();

    const obj_reloaded = constructObject(expandedNodeId);
    obj_reloaded.decode(stream, options);


    function redirectToNull(functor) {
        const old = console.log;

        console.log = function () {
        };

        try {
            functor();
        }
        catch (err) {
            throw err;
        }
        finally {
            console.log = old;
        }

    }

    redirectToNull(function () {
        analyze_object_binary_encoding(obj);
    });

    compare(obj_reloaded, obj);

    return obj_reloaded;
}


function json_encode_decode_round_trip_test(obj, options, callbackBuffer) {

    if (!callbackBuffer && _.isFunction(options)) {
        callbackBuffer = options;
        options = {};
    }
    callbackBuffer = callbackBuffer || dump_block_in_debug_mode;

    should.exist(obj);

    const json = JSON.stringify(obj);

    const obj_reloaded = JSON.parse(json);

    //xx console.log(json);

    compare(obj_reloaded, obj);

    return obj_reloaded;

}


export {
    encodeDecodeRoundTripTest as encode_decode_round_trip_test,
    json_encode_decode_round_trip_test
};

