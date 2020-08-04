import tile_schema from "../../../src/data/tile-data-schema.json";
import test_tiles from "../../../src/data/simple-tile-data.json";
import pocket_tiles from "../../../src/data/pocket-tile-data.json";
import great_tiles from "../../../src/data/great-tile-data.json";
import valid_test_tiles from "../data/valid-test-tile-data1.json";
import Ajv from 'ajv';
import { expect } from 'chai';
import 'mocha';


describe("Validate tile data definition files", function () {

    describe("the tile data definition file schema", function () {

        context("when loaded", function () {
            it("should be valid", function () {
                let ajv = new Ajv();
                let valid = ajv.validateSchema(tile_schema);
                console.log(ajv.errorsText());
                expect(valid).to.be.true;
            });
        });

    });

    describe("the valid test tiles data definition", function () {

        context("when loaded", function () {
            it("should validate", function () {
                let ajv = new Ajv();
                let valid = ajv.validate(tile_schema, valid_test_tiles.testTileData);
                console.log(ajv.errorsText());
                expect(valid).to.be.true;
            });
        });

    });

    describe("the test tiles data definition", function () {

        context("when loaded", function () {
            it("should validate", function () {
                let ajv = new Ajv();
                let valid = ajv.validate(tile_schema, test_tiles);
                console.log(ajv.errorsText());
                expect(valid).to.be.true;
            });
        });

    });

    describe("the pocket tiles data definition", function () {

        context("when loaded", function () {
            it("should validate", function () {
                let ajv = new Ajv();
                let valid = ajv.validate(tile_schema, pocket_tiles);
                console.log(ajv.errorsText());
                expect(valid).to.be.true;
            });
        });

    });

    describe("the great tiles data definition", function () {

        context("when loaded", function () {
            it("should validate", function () {
                let ajv = new Ajv();
                let valid = ajv.validate(tile_schema, great_tiles);
                console.log(ajv.errorsText());
                expect(valid).to.be.true;
            });
        });

    });

});
