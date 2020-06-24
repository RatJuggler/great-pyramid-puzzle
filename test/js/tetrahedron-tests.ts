import * as valid_config1 from "../valid-test-puzzle-data1.json";
import * as invalid_config1 from "../invalid-face-puzzle-data1.json";
import { Tetrahedron } from '../../src/js/tetrahedron';
import { Face } from "../../src/js/face";
import { assert, expect } from 'chai';
import 'mocha';


describe("Tetrahedron behaviour", function () {

    const validPuzzleData = valid_config1.testPuzzleData;

    describe("if a new Tetrahedron is created", function () {

        context("with valid configuration data file 1", function () {
            it("should return a correctly initialised instance", function () {
                const tetrahedron =
                    new Tetrahedron(validPuzzleData.puzzle, validPuzzleData.numberOfTilesPerFace, validPuzzleData.faces);
                expect(tetrahedron).to.be.an.instanceOf(Tetrahedron);
                const expectedToString = "Puzzle Type: test-valid\n" +
                    "Face: 1, Tile Positions: 1, Joins: (1-A->3-B)(1-B->4-B)(1-C->2-B)\n" +
                    "TilePosition: 1, Joins: (1-A->3-1-B)(1-B->4-1-B)(1-C->2-1-B)\n" +
                    "Face: 2, Tile Positions: 1, Joins: (2-A->3-C)(2-B->1-C)(2-C->4-A)\n" +
                    "TilePosition: 1, Joins: (1-A->3-1-C)(1-B->1-1-C)(1-C->4-1-A)\n" +
                    "Face: 3, Tile Positions: 1, Joins: (3-A->4-C)(3-B->1-A)(3-C->2-A)\n" +
                    "TilePosition: 1, Joins: (1-A->4-1-C)(1-B->1-1-A)(1-C->2-1-A)\n" +
                    "Face: 4, Tile Positions: 1, Joins: (4-A->2-C)(4-B->1-B)(4-C->3-A)\n" +
                    "TilePosition: 1, Joins: (1-A->2-1-C)(1-B->1-1-B)(1-C->3-1-A)\n";
                expect(tetrahedron.toString()).to.equal(expectedToString);
            });
        });

        context("with invalid face configuration data file 1", function () {
            it("should throw an error", function () {
                const puzzleData = invalid_config1.testPuzzleData;
                expect(function () {
                    new Tetrahedron(puzzleData.puzzle, puzzleData.numberOfTilesPerFace, puzzleData.faces);
                }).to.throw(Error, "Tetrahedron must always have configuration data for 4 Faces!");
            });
        });

    });

    describe("if #getFace() is called with the name of a Face on the Tetrahedron", function () {

        context("when there is a Face with the given name already on the Tetrahedron", function () {
            it("should return the Face details", function () {
                const tetrahedron =
                    new Tetrahedron(validPuzzleData.puzzle, validPuzzleData.numberOfTilesPerFace, validPuzzleData.faces);
                const face = tetrahedron.getFace("3");
                expect(face).to.be.an.instanceOf(Face);
                const expectedToString = "";
                expect(face.toString()).to.equal(expectedToString);
            });
        });

        context("when there isn't a Face with the given name on the Tetrahedron", function () {
            it("should throw an error", function () {
                const tetrahedron =
                    new Tetrahedron(validPuzzleData.puzzle, validPuzzleData.numberOfTilesPerFace, validPuzzleData.faces);
                expect(function () {
                    tetrahedron.getFace("A");
                }).to.throw(Error, "Face (A) not found on Tetrahedron!");
            });
        });

    });

    describe("if #placeTileWithoutMatching() is called to place a Tile (without using matching)", function () {

        context("and the Tetrahedron has no Tiles on it", function () {
            it("should place the Tile in a random Position on a random Face and return True", function () {
                assert.fail("Test not implemented!");
            });
        });

        context("and the Tetrahedron already has Tiles on it", function () {
            it("should place the Tile in a random empty Position on a random Face and return True", function () {
                assert.fail("Test not implemented!");
            });
        });

        context("and the Tetrahedron has no remaining empty positions", function () {
            it("should return False", function () {
                assert.fail("Test not implemented!");
            });
        });

    });

});
