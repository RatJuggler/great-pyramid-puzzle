import { testPuzzle } from "../../src/js/test-puzzle";
import { pocketPuzzle } from "../../src/js/pocket-puzzle";
import { greatPuzzle } from "../../src/js/great-puzzle";
import { expect } from 'chai';
import 'mocha';


describe("Puzzle data sources behaviour", function () {

    context("for the Test Puzzle", function () {
        it("should have layout data", function () {
            expect(testPuzzle).to.haveOwnProperty("layoutData");
        });
        it("should have tile data", function () {
            expect(testPuzzle).to.haveOwnProperty("tileData");
        });
        it("should have display data", function () {
            expect(testPuzzle).to.haveOwnProperty("displayData");
        });
    })

    context("for the Pocket Puzzle", function () {
        it("should have layout data", function () {
            expect(pocketPuzzle).to.haveOwnProperty("layoutData");
        });
        it("should have tile data", function () {
            expect(pocketPuzzle).to.haveOwnProperty("tileData");
        });
        it("should have display data", function () {
            expect(pocketPuzzle).to.haveOwnProperty("displayData");
        });
    })

    context("for the Great Puzzle", function () {
        it("should have layout data", function () {
            expect(greatPuzzle).to.haveOwnProperty("layoutData");
        });
        it("should have tile data", function () {
            expect(greatPuzzle).to.haveOwnProperty("tileData");
        });
        it("should have display data", function () {
            expect(greatPuzzle).to.haveOwnProperty("displayData");
        });
    })

});
