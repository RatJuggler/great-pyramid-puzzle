import * as valid_config1 from "../valid-test-puzzle-data1.json";
import * as invalid_config1 from "../invalid-test-puzzle-data1.json";
import { Tetrahedron } from '../../src/js/tetrahedron';
import { expect } from 'chai';
import 'mocha';

describe("Tetrahedron behaviour", () => {

    describe("a new Tetrahedron", () => {

        context("with valid configuration file", () => {
            it("should return a correctly initialised instance", () => {
                const puzzle = new Tetrahedron(valid_config1.testPuzzleData);
                expect(puzzle.name).to.equal("test-valid");
            });
        });

        context("with invalid configuration file 1", () => {
            it("should throw an error", () => {
                expect(() => {
                    new Tetrahedron(invalid_config1.testPuzzleData);
                }).to.throw(Error, "Tetrahedron must always have configuration data for 4 Faces!");
            });
        });

    });

});
