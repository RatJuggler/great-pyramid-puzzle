import { testPuzzle } from "../../src/js/test-puzzle";
import { pocketPuzzle } from "../../src/js/pocket-puzzle";
import { greatPuzzle } from "../../src/js/great-puzzle";
import { getPuzzleComponents } from "../../src/js/puzzle-loader";
import { getPuzzleTypeData, getTileSelection, placeTile } from "../../src/js/app-options";
import { Tile } from "../../src/js/tile";
import { expect } from 'chai';
import 'mocha';
// @ts-ignore
import { VALID_TEST_PUZZLE} from "./common-test-data";
import {TilePosition} from "../../src/js/tile-position";


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


describe("#getTileSelection behaviour", function () {

    describe("when called", function () {

        context("with an invalid tile selection", function () {
            it("should throw an error", function () {
                const components = getPuzzleComponents(VALID_TEST_PUZZLE);
                expect(function () {
                    getTileSelection(components.tilePool, "error");
                }).to.throw(Error, "Invalid tile selection option!");
            });
        });

        context("with the Tile Selection argument 'Random'", function () {
            it("should return a random Tile", function () {
                const components = getPuzzleComponents(VALID_TEST_PUZZLE);
                const result = getTileSelection(components.tilePool, "Random");
                expect(result).to.be.an.instanceOf(Tile);
            });
        });

        context("with the Tile Selection argument 'Sequential'", function () {
            it("should return the first sequential Tile", function () {
                const components = getPuzzleComponents(VALID_TEST_PUZZLE);
                const tile = getTileSelection(components.tilePool, "Sequential");
                expect(tile.id).to.equal(1);
            });
        });

        context("with the Tile Selection argument 'Test'", function () {
            it("should return the test Tile", function () {
                const components = getPuzzleComponents(VALID_TEST_PUZZLE);
                const tile = getTileSelection(components.tilePool, "Test");
                expect(tile.id).to.equal(0);
            });
        });

    });

});


describe("#placeTile() behaviour", function () {

    describe("when called", function () {

        context("with an invalid tile placement", function () {
            it("should throw an error", function () {
                const components = getPuzzleComponents(VALID_TEST_PUZZLE);
                expect(function () {
                    placeTile(components.tilePool.nextTile!, components.tetrahedron, "error", "Random");
                }).to.throw(Error, "Invalid tile placement option!");
            });
        });

        context("with an invalid tile rotation", function () {
            it("should throw an error", function () {
                const components = getPuzzleComponents(VALID_TEST_PUZZLE);
                expect(function () {
                    placeTile(components.tilePool.nextTile!, components.tetrahedron, "Random", "error");
                }).to.throw(Error, "Invalid tile rotation option!");
            });
        });

        context("with valid placement options", function () {
            it("should return an updated TilePosition", function () {
                const components = getPuzzleComponents(VALID_TEST_PUZZLE);
                const tileToPlace = components.tilePool.nextTile!
                const result = placeTile(tileToPlace, components.tetrahedron, "Sequential", "None");
                expect(result).to.be.an.instanceOf(TilePosition);
                expect(result.id).to.equal("1-1");
                expect(result.tile).to.eql(tileToPlace);
            });
        });

    });

});
