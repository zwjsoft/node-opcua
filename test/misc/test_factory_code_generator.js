require("requirish")._(module);
import should from "should";
import path from "path";
import {encode_decode_round_trip_test} from "test/helpers/encode_decode_round_trip_test";
import {unregisterObject} from "lib/misc/factories";

describe("Code Generator", function () {

    const schemaFile = path.join(__dirname, "../fixtures/fixture_dummy_object.js");

    it("should produce the javascript for new complex type using template ", function () {


        // code should compile
        const DummyObject = require(schemaFile).DummyObject;
        const SomeEnumeration = require(schemaFile).SomeEnumeration;
        const main = require(schemaFile);


        const dummy = new DummyObject({
            viewVersion: 50,
            name: "Paris",
            ArrayInt: [10, 20, 30],
            typeEnum: 2
        });
        dummy.viewVersion.should.eql(50);
        dummy.name.should.eql("Paris");
        dummy.ArrayInt.should.eql([10, 20, 30]);
        dummy.typeEnum.should.eql(SomeEnumeration.SQUARE);

        const reloadedObject = encode_decode_round_trip_test(dummy);

        reloadedObject.viewVersion.should.eql(dummy.viewVersion);
        reloadedObject.name.should.eql(dummy.name);
        reloadedObject.ArrayInt.should.eql([10, 20, 30]);
        reloadedObject.typeEnum.should.eql(dummy.typeEnum);

        (function () {
            dummy.setTypeEnum("toto");
        }).should.throw();

    });
    it("should handle new type with base class ", function () {

        const FooBarDerived = require(schemaFile).FooBarDerived;
        const FooBar = require(schemaFile).FooBar;

        const fb = new FooBarDerived({name: "toto", name2: 'titi'});
        fb.name.should.eql("toto");
        fb.name2.should.eql("titi");

        fb.should.be.instanceOf(FooBarDerived);
        fb.should.be.instanceOf(FooBar);

        const reloaded_fb = encode_decode_round_trip_test(fb);
        reloaded_fb.name.should.eql(fb.name);
        reloaded_fb.name2.should.eql(fb.name2);
    });


    it("should handle Schema with recursion ", function () {

        const schemaFile = path.join(__dirname, "../fixtures/fixture_foo_object_with_recursion.js");
        const FooWithRecursion = require(schemaFile).FooWithRecursion;

        let foo = new FooWithRecursion({});

        should(foo.inner).be.eql(null);

        foo = new FooWithRecursion({
            inner: {name: "inside level1"}
        });

        should.exist(foo.inner);
        foo.inner.name.should.eql("inside level1");
        should(foo.inner.inner).eql(null);

        foo = new FooWithRecursion({
            inner: {
                name: "inside level1",
                inner: {
                    name: "inside level2"
                }

            }
        });
        should.exist(foo.inner);
        foo.inner.name.should.eql("inside level1");
        should.exist(foo.inner.inner);
        foo.inner.inner.name.should.eql("inside level2");
        should.not.exist(foo.inner.inner.inner);

        // const foo_reloaded = encode_decode_round_trip_test(foo);

        const schema = require(schemaFile);
        unregisterObject(schema.FooWithRecursion_Schema);

    });


});
