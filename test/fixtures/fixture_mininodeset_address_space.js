require("requirish")._(module);

import AddressSpace from "lib/address_space/AddressSpace";
import generateAddressSpace from "lib/address_space/generateAddressSpace";
var should = require("should");
var path = require("path");
var assert = require("better-assert");


exports.get_mini_address_space = function (callback) {
    var addressSpace = null;
    if (addressSpace) {
        return callback(null, addressSpace);
    }
    addressSpace = new AddressSpace();

    // register namespace 1 (our namespace);
    var serverNamespaceIndex = addressSpace.registerNamespace("http://MYNAMESPACE");
    assert(serverNamespaceIndex === 1);

    var util = require("util");
    var nodeset_filename = path.join(__dirname ,"../../lib/server/mini.Node.Set2.xml");
    generateAddressSpace(addressSpace, nodeset_filename, function () {
        callback(null, addressSpace);
    });

};
