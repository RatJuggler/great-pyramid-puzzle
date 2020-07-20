import { testPuzzle } from "../../src/js/test-puzzle";
import { pocketPuzzle } from "../../src/js/pocket-puzzle";
import { greatPuzzle } from "../../src/js/great-puzzle";
import { getPuzzleTypeData } from "../../src/js/app-options";
import { expect } from 'chai';
import 'mocha';


describe("#getPuzzleTypeData behaviour", function () {

    describe("when called", function () {

        context("with an invalid puzzle type", function () {
            it("should throw an error", function () {
                expect(function () {
                    getPuzzleTypeData("error");
                }).to.throw(Error, "Invalid puzzle type option!");
            });
        });

        context("with puzzle type argument 'Test'", function () {
            it("should return the Test puzzle data", function () {
                const result = getPuzzleTypeData("Test");
                expect(result).to.eql(testPuzzle);
            });
        });

        context("with puzzle type argument 'Pocket'", function () {
            it("should return the Pocket puzzle data", function () {
                const result = getPuzzleTypeData("Pocket");
                expect(result).to.eql(pocketPuzzle);
            });
        });

        context("with puzzle type argument 'Great'", function () {
            it("should return the Great puzzle data", function () {
                const result = getPuzzleTypeData("Great");
                expect(result).to.eql(greatPuzzle);
            });
        });

    });

});
