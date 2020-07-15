import { getPuzzleComponents } from "../../src/js/puzzle-loader";
import { getPuzzleTypeData, getTileSelection, placeTile } from "../../src/js/app-options";
import { expect } from 'chai';
import 'mocha';
// @ts-ignore
import { VALID_TEST_PUZZLE } from "./common-test-data";


describe("#getPuzzleTypeData behaviour", function () {

    describe("when called", function () {

        context("with an invalid puzzle type", function () {
            it("should throw an error", function () {
                expect(function () {
                    getPuzzleTypeData("error");
                }).to.throw(Error, "Invalid puzzle type option!");
            });
        });

    });

});

describe("#getTileSelection behaviour", function () {

    describe("when called", function () {

        context("with an invalid tile selection", function () {
            it("should throw an error", function () {
                const components = getPuzzleComponents(VALID_TEST_PUZZLE, "test");
                expect(function () {
                    getTileSelection(components.tilePool, "error");
                }).to.throw(Error, "Invalid tile selection option!");
            });
        });

    });

});

describe("#placeTile() behaviour", function () {

    describe("when called", function () {

        context("with an invalid tile placement", function () {
            it("should throw an error", function () {
                const components = getPuzzleComponents(VALID_TEST_PUZZLE, "test");
                expect(function () {
                    placeTile(components.tilePool.nextTile!, components.tetrahedron, "error", "Random");
                }).to.throw(Error, "Invalid tile placement option!");
            });
        });

        context("with an invalid tile rotation", function () {
            it("should throw an error", function () {
                const components = getPuzzleComponents(VALID_TEST_PUZZLE, "test");
                expect(function () {
                    placeTile(components.tilePool.nextTile!, components.tetrahedron, "Random", "error");
                }).to.throw(Error, "Invalid tile rotation option!");
            });
        });

    });

});
