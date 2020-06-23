import * as valid_config1 from "../valid-test-puzzle-data1.json";
import * as invalid_config1 from "../invalid-test-puzzle-data1.json";
import { Tetrahedron } from '../../src/js/tetrahedron';
import { expect } from 'chai';
import 'mocha';


describe("Tetrahedron behaviour", function () {

    describe("if a new Tetrahedron is created", function () {

        context("with valid configuration data file 1", function () {
            it("should return a correctly initialised instance", function () {
                const puzzleData = valid_config1.testPuzzleData;
                const tetrahedron = new Tetrahedron(puzzleData.puzzle, puzzleData.numberOfTilesPerFace, puzzleData.faces);
                expect(tetrahedron).to.be.an.instanceOf(Tetrahedron);
                expect(tetrahedron.name).to.equal("test-valid");
            });
        });

        context("with invalid configuration data file 1", function () {
            it("should throw an error", function () {
                const puzzleData = invalid_config1.testPuzzleData;
                expect(function () {
                    new Tetrahedron(puzzleData.puzzle, puzzleData.numberOfTilesPerFace, puzzleData.faces);
                }).to.throw(Error, "Tetrahedron must always have configuration data for 4 Faces!");
            });
        });

    });

    describe("if a Tile is placed on a Tetrahedron (without using matching)", function () {

        context("and the Tetrahedron has no Tiles on it", function () {
            it("should be placed in a random position", function () {

            });
        });

        context("and the Tetrahedron already has Tiles on it", function () {
            it("should be placed in a random empty position", function () {

            });
        });

        context("and the Tetrahedron has no remaining empty positions", function () {
            it("should return undefined", function () {

            });
        });

    });

});
