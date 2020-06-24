import * as valid_config1 from "../valid-test-puzzle-data1.json";
import * as invalid_config1 from "../invalid-tile-puzzle-data1.json";
import * as invalid_config2 from "../invalid-tile-puzzle-data2.json";
import { Tile } from "../../src/js/tile";
import { TilePool } from '../../src/js/tile-pool';
import {assert, expect} from 'chai';
import 'mocha';


describe("TilePool behavior", function () {

    const puzzleData = valid_config1.testPuzzleData;

    describe("if a new TilePool is created", function () {

        context("with valid configuration data file 1", function () {
            it("should return a correctly initialised instance", function () {
                const tilePool = new TilePool(puzzleData.totalNumberOfTiles, puzzleData.tiles);
                expect(tilePool).to.be.an.instanceOf(TilePool);
                const expectedToString = "TilePool:\n" +
                    "Tile: 1, Side-A: 1010, Side-B: 0010, Side-C: 0010\n" +
                    "Tile: 2, Side-A: 0100, Side-B: 0100, Side-C: 1001\n" +
                    "Tile: 3, Side-A: 0101, Side-B: 1001, Side-C: 1010\n" +
                    "Tile: 4, Side-A: 0010, Side-B: 0100, Side-C: 0101\n";
                expect(tilePool.toString()).to.equal(expectedToString);
            });
        });

        context("with invalid tile configuration data file 1", function () {
            it("should throw an error", function () {
                const puzzleData = invalid_config1.testPuzzleData;
                expect(function () {
                    new TilePool(puzzleData.totalNumberOfTiles, puzzleData.tiles);
                }).to.throw(Error, "Number of tiles provided (4) does not match number expected (64)!");
            });
        });

        context("with invalid tile configuration data file 2", function () {
            it("should throw an error", function () {
                const puzzleData = invalid_config2.testPuzzleData;
                expect(function () {
                    new TilePool(puzzleData.totalNumberOfTiles, puzzleData.tiles);
                }).to.throw(Error, "Duplicate Tile found in pool for (3)!");
            });
        });

    });

    describe("if #addTile() is called with details of a Tile to add to the TilePool", function () {

        context("when the TilePool is empty", function () {
            it("should add the Tile and return True", function () {
                assert.fail("Test not implemented!");
            });
        });

        context("when the TilePool already has Tiles in it but not one with the same id", function () {
            it("should add the Tile and return True", function () {
                assert.fail("Test not implemented!");
            });
        });

        context("when the TilePool already contains a Tile with the same id as the one being added", function () {
            it("should not add the Tile and return False", function () {
                assert.fail("Test not implemented!");
            });
        });

    });

    describe("if #getTile() is called with the id of a Tile to obtain from the TilePool", function () {

        context("when there is a Tile with the given id already in the TilePool", function () {
            it("should remove the Tile from the pool and return the Tile details", function () {
                assert.fail("Test not implemented!");
            });
        });

        context("when there isn't a Tile with the given id in the TilePool", function () {
            it("should throw an error", function () {
                assert.fail("Test not implemented!");
            });
        });

        context("when the TilePool is empty", function () {
            it("should throw an error", function () {
                assert.fail("Test not implemented!");
            });
        });

    });

    describe("if #getRandomTile() is called to select a random Tile from the TilePool", function () {

        context("when there are Tiles remaining in the TilePool", function () {
            it("should return a random Tile from those remaining", function () {
                const tilePool = new TilePool(puzzleData.totalNumberOfTiles, puzzleData.tiles);
                expect(tilePool.randomTile).to.be.an.instanceOf(Tile);
            });
        });

        context("when there are no Tiles remaining in the TilePool", function () {
            it("should return null", function () {
                const tilePool = new TilePool(puzzleData.totalNumberOfTiles, puzzleData.tiles);
                for (let i = 0; i < puzzleData.totalNumberOfTiles; i++) {
                    expect(tilePool.randomTile).to.be.an.instanceOf(Tile);
                }
                expect(tilePool.randomTile).to.be.null;
            });
        });

    });

});
