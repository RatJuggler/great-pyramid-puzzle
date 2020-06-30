import puzzle_schema from "../../src/puzzle-data-schema.json";
import test_puzzle from "../valid-test-puzzle-data1.json";
import pocket_puzzle from "../../src/pocket-puzzle-data.json";
import great_puzzle from "../../src/great-puzzle-data.json";
import Ajv from 'ajv';
import { expect } from 'chai';
import 'mocha';


describe("Validate puzzle definition files", function () {

    describe("the puzzle definition file schema", function () {

        context("when loaded", function () {
            it("should be valid", function () {
                let ajv = new Ajv();
                let valid = ajv.validateSchema(puzzle_schema);
                console.log(ajv.errorsText());
                expect(valid).to.be.true;
            });
        });

    });

    describe("the valid test puzzle definition", function () {

        context("when loaded", function () {
            it("should validate", function () {
                let ajv = new Ajv();
                let valid = ajv.validate(puzzle_schema, test_puzzle.testPuzzleData);
                console.log(ajv.errorsText());
                expect(valid).to.be.true;
            });
        });

    });

    describe("the pocket puzzle definition", function () {

        context("when loaded", function () {
            it("should validate", function () {
                let ajv = new Ajv();
                let valid = ajv.validate(puzzle_schema, pocket_puzzle);
                console.log(ajv.errorsText());
                expect(valid).to.be.true;
            });
        });

    });

    describe("the great puzzle definition", function () {

        context("when loaded", function () {
            it("should validate", function () {
                let ajv = new Ajv();
                let valid = ajv.validate(puzzle_schema, great_puzzle);
                console.log(ajv.errorsText());
                expect(valid).to.be.true;
            });
        });

    });

});
