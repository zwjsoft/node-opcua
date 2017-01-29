import  should from "should";
import {normalizeRequireFile} from "lib/misc/utils";

describe("normalizeRequireFile", function () {

    it("should normalizeRequireFile", function () {
        normalizeRequireFile("/home/bob/folder1/", "/home/bob/folder1/folder2/toto.js").should.eql("./folder2/toto");
    });

});

