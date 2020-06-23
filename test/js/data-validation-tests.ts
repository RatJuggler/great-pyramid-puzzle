import * as puzzle_schema from "../../src/puzzle-data-schema.json";
import * as test_puzzle from "../valid-test-puzzle-data1.json";
import * as pocket_puzzle from "../../src/pocket-puzzle-data.json";
import * as great_puzzle from "../../src/great-puzzle-data.json";
import Ajv from 'ajv';
import { expect } from 'chai';
import 'mocha';


describe("Validate puzzle definition files", () => {

    describe("the puzzle definition file schema", () => {

        context("when loaded", () => {
            it("should be valid", () => {
                let valid = ajv.validateSchema(puzzle_schema);
                if (!valid) console.log(validate.errors);
                expect(valid).to.be.true;
            });
        });

    });

    let ajv = new Ajv();
    let validate = ajv.compile(puzzle_schema);

    describe("the valid test puzzle definition", () => {

        context("when loaded", () => {
            it("should validate", () => {
                let valid = validate(test_puzzle.testPuzzleData);
                if (!valid) console.log(validate.errors);
                expect(valid).to.be.true;
            });
        });

    });

    describe("the pocket puzzle definition", () => {

        context("when loaded", () => {
            it("should validate", () => {
                let valid = validate(pocket_puzzle);
                if (!valid) console.log(validate.errors);
                expect(valid).to.be.true;
            });
        });

    });

    describe("the great puzzle definition", () => {

        context("when loaded", () => {
            it("should validate", () => {
                let valid = validate(great_puzzle);
                if (!valid) console.log(validate.errors);
                expect(valid).to.be.true;
            });
        });

    });

});
