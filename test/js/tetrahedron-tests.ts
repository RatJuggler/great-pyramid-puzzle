import * as valid_config from "../valid-test-puzzle-data.json";
import * as invalid_config from "../invalid-test-puzzle-data.json";
import { Tetrahedron } from '../../src/js/tetrahedron';
import { expect } from 'chai';
import 'mocha';

describe("Tetrahedron behaviour", () => {

    describe("a new Tetrahedron", () => {

        context("with valid parameters", () => {
            it("should return a correctly initialised instance", () => {
                const puzzle = new Tetrahedron(valid_config);
                expect(puzzle.name).to.equal("test-valid");
            });
        });

        context("with invalid parameters", () => {
            it("should throw an error", () => {
                expect(() => {
                    new Tetrahedron(invalid_config);
                }).to.throw(Error, "Number of tiles on a Face must be one of 1,4,9!");
            });
        });

    });

});
