import valid_config1 from "../valid-test-puzzle-data1.json";
import invalid_config1 from "../invalid-tile-puzzle-data1.json";
import invalid_config2 from "../invalid-tile-puzzle-data2.json";
import { Tile } from "../../src/js/tile";
import { TilePool } from '../../src/js/tile-pool';
import { assert, expect } from 'chai';
import 'mocha';
// @ts-ignore
import { TILE_1, TILE_1_DATA } from "./common-test-data";


describe("TilePool behavior", function () {

    const validPuzzleData = valid_config1.testPuzzleData;
    const validTilePoolToString = "TilePool:\n" +
        "Id: 1, Side-A: 1010, Side-B: 0010, Side-C: 0010\n" +
        "Id: 2, Side-A: 0100, Side-B: 0100, Side-C: 1001\n" +
        "Id: 3, Side-A: 0101, Side-B: 1001, Side-C: 1010\n" +
        "Id: 4, Side-A: 0010, Side-B: 0100, Side-C: 0101\n";


    describe("if a new TilePool is created", function () {

        context("with valid configuration data file 1", function () {
            const tilePool = new TilePool(validPuzzleData.totalNumberOfTiles, validPuzzleData.tiles);
            it("should return a correctly initialised instance", function () {
                expect(tilePool).to.be.an.instanceOf(TilePool);
            });
            it("should also return the correct toString result from this instance", function () {
                expect(tilePool.toString()).to.equal(validTilePoolToString);
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
            const tilePool = new TilePool(0, []);
            const result = tilePool.addTile(TILE_1_DATA);
            it("should add the Tile", function () {
                expect(tilePool.toString()).to.contain(TILE_1.toString());
            });
            it("should return True", function () {
                expect(result).to.be.true;
            });
        });

        context("when the TilePool already has Tiles in it but not one with the same id", function () {
            const tilePool = new TilePool(validPuzzleData.totalNumberOfTiles, validPuzzleData.tiles);
            const result = tilePool.addTile(TILE_1_DATA);
            it("should add the Tile", function () {
                expect(tilePool.toString()).to.contain(TILE_1.toString());
            });
            it("should return True", function () {
                expect(result).to.be.true;
            });
        });

        context("when the TilePool already contains a Tile with the same id as the one being added", function () {
            const tilePool = new TilePool(validPuzzleData.totalNumberOfTiles, validPuzzleData.tiles);
            assert.isTrue(tilePool.addTile(TILE_1_DATA));
            const result2 = tilePool.addTile(TILE_1_DATA);
            it("should not add the Tile", function () {
                expect(tilePool.toString()).to.equal(validTilePoolToString + TILE_1.toString() + '\n');
            });
            it("should return False", function () {
                expect(result2).to.be.false;
            });
        });

    });

    describe("if #getTile() is called with the id of a Tile to obtain from the TilePool", function () {

        context("when there is a Tile with the given id already in the TilePool", function () {
            const tilePool = new TilePool(validPuzzleData.totalNumberOfTiles, validPuzzleData.tiles);
            assert.isTrue(tilePool.addTile(TILE_1_DATA));
            const tile = tilePool.getTile(TILE_1_DATA.tile);
            it("should remove the Tile from the pool", function () {
                expect(tilePool.toString()).to.equal(validTilePoolToString);
            });
            it("should return the Tile details", function () {
                expect(tile).to.be.an.instanceOf(Tile);
                expect(tile.toString()).to.equal(TILE_1.toString());
            });
        });

        context("when there isn't a Tile with the given id in the TilePool", function () {
            it("should throw an error", function () {
                const tilePool = new TilePool(validPuzzleData.totalNumberOfTiles, validPuzzleData.tiles);
                expect(function () {
                    tilePool.getTile("TestTile");
                }).to.throw(Error, "Tile (TestTile) not found in the tile pool!");
            });
        });

        context("when the TilePool is empty", function () {
            it("should throw an error", function () {
                const tilePool = new TilePool(0, []);
                expect(function () {
                    tilePool.getTile("TestTile");
                }).to.throw(Error, "Tile (TestTile) not found in the tile pool!");
            });
        });

    });

    describe("if #getRandomTile() is called to select a random Tile from the TilePool", function () {

        context("when there are Tiles remaining in the TilePool", function () {
            const tilePool = new TilePool(validPuzzleData.totalNumberOfTiles, validPuzzleData.tiles);
            const oldPoolToString = tilePool.toString();
            const tile = tilePool.randomTile;
            it("should return a random Tile from those remaining", function () {
                expect(tile).to.be.an.instanceOf(Tile);
            });
            it("should remove the random Tile from the pool", function () {
                expect(oldPoolToString).to.contain(tile!.toString());
                expect(tilePool.toString()).to.not.contain(tile!.toString());
            });
        });

        context("when there are no Tiles remaining in the TilePool", function () {
            it("should return null", function () {
                const tilePool = new TilePool(validPuzzleData.totalNumberOfTiles, validPuzzleData.tiles);
                for (let i = 0; i < validPuzzleData.totalNumberOfTiles; i++) {
                    expect(tilePool.randomTile).to.be.an.instanceOf(Tile);
                }
                expect(tilePool.randomTile).to.be.null;
            });
        });

    });

});
