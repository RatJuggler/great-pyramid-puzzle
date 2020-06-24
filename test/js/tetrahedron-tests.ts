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
                let expectedToString = "Puzzle Type: test-valid\n" +
                    "Face: 1, Tile Positions: 1, Joins: (1-A->3-B)(1-B->4-B)(1-C->2-B)\n" +
                    "Tile: 1, Joins: (1-A->3-1-B)(1-B->4-1-B)(1-C->2-1-B)\n" +
                    "Face: 2, Tile Positions: 1, Joins: (2-A->3-C)(2-B->1-C)(2-C->4-A)\n" +
                    "Tile: 1, Joins: (1-A->3-1-C)(1-B->1-1-C)(1-C->4-1-A)\n" +
                    "Face: 3, Tile Positions: 1, Joins: (3-A->4-C)(3-B->1-A)(3-C->2-A)\n" +
                    "Tile: 1, Joins: (1-A->4-1-C)(1-B->1-1-A)(1-C->2-1-A)\n" +
                    "Face: 4, Tile Positions: 1, Joins: (4-A->2-C)(4-B->1-B)(4-C->3-A)\n" +
                    "Tile: 1, Joins: (1-A->2-1-C)(1-B->1-1-B)(1-C->3-1-A)\n";
                expect(tetrahedron.toString()).to.equal(expectedToString);
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

    describe("if #placeTileWithoutMatching() is called to place a Tile (without using matching)", function () {

        context("and the Tetrahedron has no Tiles on it", function () {
            it("should place the Tile in a random Position on a random Face and return True", function () {

            });
        });

        context("and the Tetrahedron already has Tiles on it", function () {
            it("should place the Tile in a random empty Position on a random Face and return True", function () {

            });
        });

        context("and the Tetrahedron has no remaining empty positions", function () {
            it("should return False", function () {

            });
        });

    });

});
