import { getPuzzleComponents} from "../../src/js/puzzle-loader";
import { expect } from 'chai';
import 'mocha';
// @ts-ignore
import { VALID_TEST_PUZZLE, INVALID_TEST_PUZZLE_1, INVALID_TEST_PUZZLE_2 } from "./common-test-data";


describe("if #getPuzzleComponents() is called", function () {

    context("with a valid set of data elements", function () {
        const result = getPuzzleComponents(VALID_TEST_PUZZLE);
        it("should return a valid set of components", function () {
            expect(result).to.have.property("tilePool");
            expect(result).to.have.property("tetrahedron");
        });
    });

    context("with invalid layout data file 1", function () {
        it("should throw an error", function () {
            expect(function () {
                getPuzzleComponents(INVALID_TEST_PUZZLE_1);
            }).to.throw(Error, "Tetrahedron must always have configuration data for 4 Faces!");
        });
    });

    context("with invalid set of data elements", function () {
        it("should throw an error", function () {
            expect(function () {
                getPuzzleComponents(INVALID_TEST_PUZZLE_2);
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
