import valid_tile_config1 from "../valid-test-tile-data1.json";
import invalid_tile_config1 from "../invalid-tile-data1.json";
import invalid_tiles_config2 from "../invalid-tile-data2.json";
import { Tile } from "../../src/js/tile";
import { TilePool } from '../../src/js/tile-pool';
import { assert, expect } from 'chai';
import 'mocha';
// @ts-ignore\
import { TILE_1, TILE_1_DATA } from "./common-test-data";


describe("TilePool behavior", function () {

    const validTileData = valid_tile_config1.testTileData;
    const validTilePoolToString = "TilePool:\n" +
        "Id: 1, Side-A: 1010, Side-B: 0010, Side-C: 0010\n" +
        "Id: 2, Side-A: 0100, Side-B: 0100, Side-C: 1001\n" +
        "Id: 3, Side-A: 0101, Side-B: 1001, Side-C: 1010\n" +
        "Id: 4, Side-A: 0010, Side-B: 0100, Side-C: 0101\n";


    describe("if a new TilePool is created", function () {

        context("with valid configuration data file 1", function () {
            const tilePool = new TilePool(validTileData.totalNumberOfTiles, validTileData.tiles);
            it("should return a correctly initialised instance", function () {
                expect(tilePool).to.be.an.instanceOf(TilePool);
            });
            it("should have the correct number of Tiles in it", function () {
                expect(tilePool.tileCount).to.equal(validTileData.totalNumberOfTiles);
            });
            it("should also return the correct toString result from this instance", function () {
                expect(tilePool.toString()).to.equal(validTilePoolToString);
            });
        });

        context("with invalid tile configuration data file 1", function () {
            const puzzleData = invalid_tile_config1.testTileData;
            it("should throw an error", function () {
                expect(function () {
                    new TilePool(puzzleData.totalNumberOfTiles, puzzleData.tiles);
                }).to.throw(Error, "Number of tiles provided (4) does not match number expected (64)!");
            });
        });

        context("with invalid tile configuration data file 2", function () {
            const puzzleData = invalid_tiles_config2.testTileData;
            it("should throw an error", function () {
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
                expect(tilePool.getTile(TILE_1_DATA.tile)).to.eql(TILE_1);
            });
            it("should return True", function () {
                expect(result).to.be.true;
            });
        });

        context("when the TilePool already has Tiles in it but not one with the same id", function () {
            const tilePool = new TilePool(validTileData.totalNumberOfTiles, validTileData.tiles);
            const result = tilePool.addTile(TILE_1_DATA);
            it("should add the Tile", function () {
                expect(tilePool.getTile(TILE_1_DATA.tile)).to.eql(TILE_1);
            });
            it("should return True", function () {
                expect(result).to.be.true;
            });
        });

        context("when the TilePool already contains a Tile with the same id as the one being added", function () {
            const tilePool = new TilePool(validTileData.totalNumberOfTiles, validTileData.tiles);
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
            const tilePool = new TilePool(validTileData.totalNumberOfTiles, validTileData.tiles);
            assert.isTrue(tilePool.addTile(TILE_1_DATA));
            const tile = tilePool.getTile(TILE_1_DATA.tile);
            it("should remove the Tile from the pool", function () {
                expect(tilePool.toString()).to.equal(validTilePoolToString);
            });
            it("should return the Tile details", function () {
                expect(tile).to.be.an.instanceOf(Tile);
                expect(tile).to.eql(TILE_1);
            });
        });

        context("when there isn't a Tile with the given id in the TilePool", function () {
            const tilePool = new TilePool(validTileData.totalNumberOfTiles, validTileData.tiles);
            it("should throw an error", function () {
                expect(function () {
                    tilePool.getTile(999);
                }).to.throw(Error, "Tile (999) not found in the tile pool!");
            });
        });

        context("when the TilePool is empty", function () {
            const tilePool = new TilePool(0, []);
            it("should throw an error", function () {
                expect(function () {
                    tilePool.getTile(1);
                }).to.throw(Error, "Tile (1) not found in the tile pool!");
            });
        });

    });

    describe("if #getNextTile() is called to select the next Tile (in order) from the TilePool", function () {

        context("when no Tiles have previously been selected from the TilePool", function () {
            const tilePool = new TilePool(validTileData.totalNumberOfTiles, validTileData.tiles);
            const tile = tilePool.nextTile!;
            it("should return the first Tile (in order)", function () {
                expect(tile).to.be.an.instanceOf(Tile);
                expect(tile.id).to.equal(1);
            });
            it("should remove the Tile from the pool", function () {
                expect(function () {
                    tilePool.getTile(tile.id);
                }).to.throw(Error, "Tile (1) not found in the tile pool!");
            });
        });

        context("when there are Tiles remaining in the TilePool", function () {
            const tilePool = new TilePool(validTileData.totalNumberOfTiles, validTileData.tiles);
            const tile1 = tilePool.nextTile!;
            const tile2 = tilePool.nextTile!;
            const tile3 = tilePool.nextTile!;
            it("should return the Tiles (in order) from those remaining", function () {
                expect(tile1).to.be.an.instanceOf(Tile);
                expect(tile1.id).to.equal(1);
                expect(tile2).to.be.an.instanceOf(Tile);
                expect(tile2.id).to.equal(2);
                expect(tile3).to.be.an.instanceOf(Tile);
                expect(tile3.id).to.equal(3);
            });
            it("should remove the Tiles from the pool", function () {
                expect(function () {
                    tilePool.getTile(tile1.id);
                }).to.throw(Error, "Tile (1) not found in the tile pool!");
                expect(function () {
                    tilePool.getTile(tile2.id);
                }).to.throw(Error, "Tile (2) not found in the tile pool!");
                expect(function () {
                    tilePool.getTile(tile3.id);
                }).to.throw(Error, "Tile (3) not found in the tile pool!");
            });
        });

        context("when there are no Tiles remaining in the TilePool", function () {
            const tilePool = new TilePool(validTileData.totalNumberOfTiles, validTileData.tiles);
            for (let i = 0; i < validTileData.totalNumberOfTiles; i++) {
                assert.instanceOf(tilePool.nextTile, Tile);
            }
            it("should return null", function () {
                expect(tilePool.nextTile).to.be.null;
            });
        });

    });

    describe("if #getRandomTile() is called to select a random Tile from the TilePool", function () {

        context("when there are Tiles remaining in the TilePool", function () {
            const tilePool = new TilePool(validTileData.totalNumberOfTiles, validTileData.tiles);
            const tile = tilePool.randomTile!;
            it("should return a random Tile from those remaining", function () {
                expect(tile).to.be.an.instanceOf(Tile);
            });
            it("should remove the Tile from the pool", function () {
                expect(function () {
                    tilePool.getTile(tile.id);
                }).to.throw(Error, `Tile (${tile.id}) not found in the tile pool!`);
            });
        });

        context("when there are no Tiles remaining in the TilePool", function () {
            const tilePool = new TilePool(validTileData.totalNumberOfTiles, validTileData.tiles);
            for (let i = 0; i < validTileData.totalNumberOfTiles; i++) {
                assert.instanceOf(tilePool.randomTile, Tile);
            }
            it("should return null", function () {
                expect(tilePool.randomTile).to.be.null;
            });
        });

    });

    describe("if #getTestTile() is called to return the display test Tile", function () {

        context("while there are Tiles remaining in the TilePool", function () {
            const tilePool = new TilePool(validTileData.totalNumberOfTiles, validTileData.tiles);
            for (let i = 0; i < validTileData.totalNumberOfTiles; i++) {
                const tile = tilePool.testTile!;
                it("should always return the display test Tile", function () {
                    expect(tile).to.be.an.instanceOf(Tile);
                    expect(tile.id).to.equal(0);
                });
            }
        });

        context("when there are no Tiles remaining in the TilePool", function () {
            const tilePool = new TilePool(validTileData.totalNumberOfTiles, validTileData.tiles);
            for (let i = 0; i < validTileData.totalNumberOfTiles; i++) {
                assert.instanceOf(tilePool.testTile, Tile);
            }
            it("should return null", function () {
                expect(tilePool.testTile).to.be.null;
            });
        });

    });

});
