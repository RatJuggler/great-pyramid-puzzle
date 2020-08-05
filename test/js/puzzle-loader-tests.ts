import { getPuzzleComponents} from "../../src/js/puzzle-loader";
import { Tetrahedron } from "../../src/js/puzzle/tetrahedron";
import { expect } from 'chai';
import 'mocha';
// @ts-ignore
import { VALID_TEST_PUZZLE, INVALID_TEST_PUZZLE_1, INVALID_TEST_PUZZLE_2, INVALID_TEST_PUZZLE_3 } from "./common-test-data";


describe("if #getPuzzleComponents() is called", function () {

    context("with a valid set of data elements", function () {
        const result = getPuzzleComponents(VALID_TEST_PUZZLE);
        it("should return a valid set of components", function () {
            expect(result).to.have.property("tilePool");
            expect(result).to.have.property("tetrahedron");
        });
        it("should return a correctly initialised instance Tetrahedron", function () {
            expect(result.tetrahedron).to.be.an.instanceOf(Tetrahedron);
        });
        it("should have set the puzzle name on the Tetrahedron", function () {
            expect(result.tetrahedron.name).to.equal("test-valid");
        });
        it("should have created the correct number of Tile Positions on the Tetrahedron", function () {
            expect(result.tetrahedron.tilePositionCount).to.equal(VALID_TEST_PUZZLE.layoutData.numberOfTilesPerFace * 4);
        });
        it("should create a Tetrahedron that passes the integrity check", function () {
            expect(result.tetrahedron.integrityCheck()).to.eql([true, "Passed"]);
        });
        it("should return the correct toString result for the Tetrahedron", function () {
            const expectedToString = "Puzzle Type: test-valid\n" +
                "Face: 1, Tile Positions: 1, Joins: (1-A->3-B)(1-B->4-B)(1-C->2-B)\n" +
                "TilePosition: 1, On Face: 1, Contains Tile: [Empty], Joins: (1-A->3-1-B)(1-B->4-1-B)(1-C->2-1-B)\n" +
                "Face: 2, Tile Positions: 1, Joins: (2-A->3-C)(2-B->1-C)(2-C->4-A)\n" +
                "TilePosition: 1, On Face: 2, Contains Tile: [Empty], Joins: (1-A->3-1-C)(1-B->1-1-C)(1-C->4-1-A)\n" +
                "Face: 3, Tile Positions: 1, Joins: (3-A->4-C)(3-B->1-A)(3-C->2-A)\n" +
                "TilePosition: 1, On Face: 3, Contains Tile: [Empty], Joins: (1-A->4-1-C)(1-B->1-1-A)(1-C->2-1-A)\n" +
                "Face: 4, Tile Positions: 1, Joins: (4-A->2-C)(4-B->1-B)(4-C->3-A)\n" +
                "TilePosition: 1, On Face: 4, Contains Tile: [Empty], Joins: (1-A->2-1-C)(1-B->1-1-B)(1-C->3-1-A)\n";
            expect(result.tetrahedron.toString()).to.equal(expectedToString);
        });
    });

    context("with invalid layout data file 1", function () {
        it("should throw an error", function () {
            expect(function () {
                getPuzzleComponents(INVALID_TEST_PUZZLE_1);
            }).to.throw(Error, "Tetrahedron must always have configuration data for 4 Faces!");
        });
    });

    context("with invalid layout data file 2", function () {
        const expectedError =
            "Face joins not complete: Face: 1, Tile Positions: 1, Joins: \n" +
            "TilePosition: 1, On Face: 1, Contains Tile: [Empty], Joins: \n";
        it("should fail the integrity check", function () {
            expect(function () {
                getPuzzleComponents(INVALID_TEST_PUZZLE_2);
            }).to.throw(Error, expectedError);
        });
    });

    context("with invalid set of data elements", function () {
        it("should throw an error", function () {
            expect(function () {
                getPuzzleComponents(INVALID_TEST_PUZZLE_3);
            }).to.throw(Error, "There must be enough Tiles to cover the Tetrahedron!");
        });
    });

    context("with an invalid puzzle type", function () {
        it("should throw an error", function () {
            expect(function () {
                getPuzzleComponents("error");
            }).to.throw(Error, "Invalid puzzle type option!");
        });
    });

    context("with puzzle type argument 'Simple'", function () {
        const result = getPuzzleComponents("Simple");
        it("should return the Test puzzle data", function () {
            expect(result).to.have.property("tilePool");
            expect(result.tilePool.tileCount).to.equal(4);
            expect(result).to.have.property("tetrahedron");
            expect(result.tetrahedron.tilePositionCount).to.equal(4);
        });
    });

    context("with puzzle type argument 'Pocket'", function () {
        const result = getPuzzleComponents("Pocket");
        it("should return the Pocket puzzle data", function () {
            expect(result).to.have.property("tilePool");
            expect(result.tilePool.tileCount).to.equal(16);
            expect(result).to.have.property("tetrahedron");
            expect(result.tetrahedron.tilePositionCount).to.equal(16);
        });
    });

    context("with puzzle type argument 'Great'", function () {
        const result = getPuzzleComponents("Great");
        it("should return the Great puzzle data", function () {
            expect(result).to.have.property("tilePool");
            expect(result.tilePool.tileCount).to.equal(36);
            expect(result).to.have.property("tetrahedron");
            expect(result.tetrahedron.tilePositionCount).to.equal(36);
        });
    });

});
