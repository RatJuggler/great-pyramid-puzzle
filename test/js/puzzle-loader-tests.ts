import { getPuzzleComponents } from "../../src/js/puzzle-loader";
import { expect } from 'chai';
import 'mocha';
// @ts-ignore
import { VALID_TEST_PUZZLE, INVALID_TEST_PUZZLE } from "./common-test-data";


describe("if #getPuzzleComponents() is called", function () {

    context("with a valid set of data elements", function () {
        const result = getPuzzleComponents(VALID_TEST_PUZZLE);
        it("should return a valid set of components", function () {
            expect(result).to.have.property("tilePool");
            expect(result).to.have.property("tetrahedron");
        });
    });

    context("with invalid set of data elements", function () {
        it("should throw an error", function () {
            expect(function () {
                getPuzzleComponents(INVALID_TEST_PUZZLE);
            }).to.throw(Error, "There must be enough Tiles to cover the Tetrahedron!");
        });
    });

});
