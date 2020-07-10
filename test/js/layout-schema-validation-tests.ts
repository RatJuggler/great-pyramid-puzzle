import layout_schema from "../../src/layout-data-schema.json";
import test_layout from "../../src/test-layout-data.json";
import pocket_layout from "../../src/pocket-layout-data.json";
import great_layout from "../../src/great-layout-data.json";
import valid_test_layout from "../valid-test-layout-data1.json";
import Ajv from 'ajv';
import { expect } from 'chai';
import 'mocha';


describe("Validate layout data definition files", function () {

    describe("the layout data definition file schema", function () {

        context("when loaded", function () {
            it("should be valid", function () {
                let ajv = new Ajv();
                let valid = ajv.validateSchema(layout_schema);
                console.log(ajv.errorsText());
                expect(valid).to.be.true;
            });
        });

    });

    describe("the valid test layout data definition", function () {

        context("when loaded", function () {
            it("should validate", function () {
                let ajv = new Ajv();
                let valid = ajv.validate(layout_schema, valid_test_layout.testLayoutData);
                console.log(ajv.errorsText());
                expect(valid).to.be.true;
            });
        });

    });

    describe("the test layout data definition", function () {

        context("when loaded", function () {
            it("should validate", function () {
                let ajv = new Ajv();
                let valid = ajv.validate(layout_schema, test_layout);
                console.log(ajv.errorsText());
                expect(valid).to.be.true;
            });
        });

    });

    describe("the pocket layout data definition", function () {

        context("when loaded", function () {
            it("should validate", function () {
                let ajv = new Ajv();
                let valid = ajv.validate(layout_schema, pocket_layout);
                console.log(ajv.errorsText());
                expect(valid).to.be.true;
            });
        });

    });

    describe("the great layout data definition", function () {

        context("when loaded", function () {
            it("should validate", function () {
                let ajv = new Ajv();
                let valid = ajv.validate(layout_schema, great_layout);
                console.log(ajv.errorsText());
                expect(valid).to.be.true;
            });
        });

    });

});
