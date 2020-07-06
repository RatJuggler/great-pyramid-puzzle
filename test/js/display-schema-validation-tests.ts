import display_schema from "../../src/display-data-schema.json";
import valid_test_display from "../valid-test-display-data1.json";
import test_display from "../../src/test-display-data.json";
import pocket_display from "../../src/pocket-display-data.json";
import great_display from "../../src/great-display-data.json";
import Ajv from 'ajv';
import { expect } from 'chai';
import 'mocha';


describe("Validate display data definition files", function () {

    describe("the display data definition file schema", function () {

        context("when loaded", function () {
            it("should be valid", function () {
                let ajv = new Ajv();
                let valid = ajv.validateSchema(display_schema);
                console.log(ajv.errorsText());
                expect(valid).to.be.true;
            });
        });

    });

    describe("the valid test display data definition", function () {

        context("when loaded", function () {
            it("should validate", function () {
                let ajv = new Ajv();
                let valid = ajv.validate(display_schema, valid_test_display);
                console.log(ajv.errorsText());
                expect(valid).to.be.true;
            });
        });

    });

    describe("the test display data definition", function () {

        context("when loaded", function () {
            it("should validate", function () {
                let ajv = new Ajv();
                let valid = ajv.validate(display_schema, test_display);
                console.log(ajv.errorsText());
                expect(valid).to.be.true;
            });
        });

    });

    describe("the pocket display data definition", function () {

        context("when loaded", function () {
            it("should validate", function () {
                let ajv = new Ajv();
                let valid = ajv.validate(display_schema, pocket_display);
                console.log(ajv.errorsText());
                expect(valid).to.be.true;
            });
        });

    });

    describe("the great display data definition", function () {

        context("when loaded", function () {
            it("should validate", function () {
                let ajv = new Ajv();
                let valid = ajv.validate(display_schema, great_display);
                console.log(ajv.errorsText());
                expect(valid).to.be.true;
            });
        });

    });

});
