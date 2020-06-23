import * as puzzle_schema from "../../src/puzzle-data-schema.json";
import * as test_puzzle from "../valid-test-puzzle-data1.json";
import * as pocket_puzzle from "../../src/pocket-puzzle-data.json";
import * as great_puzzle from "../../src/great-puzzle-data.json";
import Ajv from 'ajv';
import { expect } from 'chai';
import 'mocha';


describe("Validate puzzle definition files", () => {

    describe("the valid test puzzle definition", () => {

        context("when loaded", () => {
            it("should validate", () => {
                let ajv = new Ajv();
                let valid = ajv.validate(puzzle_schema, test_puzzle);
                console.log(ajv.errorsText());
                expect(valid).to.be.true;
            });
        });

    });

    describe("the pocket puzzle definition", () => {

        context("when loaded", () => {
            it("should validate", () => {
                let ajv = new Ajv();
                let valid = ajv.validate(puzzle_schema, pocket_puzzle);
                console.log(ajv.errorsText());
                expect(valid).to.be.true;
            });
        });

    });

    describe("the great puzzle definition", () => {

        context("when loaded", () => {
            it("should validate", () => {
                let ajv = new Ajv();
                let valid = ajv.validate(puzzle_schema, great_puzzle);
                console.log(ajv.errorsText());
                expect(valid).to.be.true;
            });
        });

    });

});
