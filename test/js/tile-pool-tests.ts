import * as valid_config1 from "../valid-test-puzzle-data1.json";
import * as invalid_config1 from "../invalid-tile-puzzle-data1.json";
import * as invalid_config2 from "../invalid-tile-puzzle-data2.json";
import { Tile } from "../../src/js/tile";
import { TileData } from "../../src/js/puzzle-data-schema";
import { TilePool } from '../../src/js/tile-pool';
import { expect} from 'chai';
import 'mocha';


describe("TilePool behavior", function () {

    const validPuzzleData = valid_config1.testPuzzleData;
    const validTilePoolToString = "TilePool:\n" +
        "Tile: 1, Side-A: 1010, Side-B: 0010, Side-C: 0010\n" +
        "Tile: 2, Side-A: 0100, Side-B: 0100, Side-C: 1001\n" +
        "Tile: 3, Side-A: 0101, Side-B: 1001, Side-C: 1010\n" +
        "Tile: 4, Side-A: 0010, Side-B: 0100, Side-C: 0101\n";
    const tileData: TileData = {
        "tile": "TestTile",
        "sideA": "0001",
        "sideB": "0010",
        "sideC": "0100"
    };
    const validTileToString = "Tile: TestTile, Side-A: 0001, Side-B: 0010, Side-C: 0100";


    describe("if a new TilePool is created", function () {

        context("with valid configuration data file 1", function () {
            it("should return a correctly initialised instance", function () {
                const tilePool = new TilePool(validPuzzleData.totalNumberOfTiles, validPuzzleData.tiles);
                expect(tilePool).to.be.an.instanceOf(TilePool);
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
            it("should add the Tile and return True", function () {
                const tilePool = new TilePool(0, []);
                const result = tilePool.addTile(tileData);
                expect(result).to.be.true;
                expect(tilePool.toString()).to.equal("TilePool:\n" + validTileToString + '\n');
            });
        });

        context("when the TilePool already has Tiles in it but not one with the same id", function () {
            it("should add the Tile and return True", function () {
                const tilePool = new TilePool(validPuzzleData.totalNumberOfTiles, validPuzzleData.tiles);
                const result = tilePool.addTile(tileData);
                expect(result).to.be.true;
                expect(tilePool.toString()).to.equal(validTilePoolToString + validTileToString + '\n');
            });
        });

        context("when the TilePool already contains a Tile with the same id as the one being added", function () {
            it("should not add the Tile and return False", function () {
                const tilePool = new TilePool(validPuzzleData.totalNumberOfTiles, validPuzzleData.tiles);
                const result1 = tilePool.addTile(tileData);
                expect(result1).to.be.true;
                const result2 = tilePool.addTile(tileData);
                expect(result2).to.be.false;
                expect(tilePool.toString()).to.equal(validTilePoolToString + validTileToString + '\n');
            });
        });

    });

    describe("if #getTile() is called with the id of a Tile to obtain from the TilePool", function () {

        context("when there is a Tile with the given id already in the TilePool", function () {
            it("should remove the Tile from the pool and return the Tile details", function () {
                const tilePool = new TilePool(validPuzzleData.totalNumberOfTiles, validPuzzleData.tiles);
                const result1 = tilePool.addTile(tileData);
                expect(result1).to.be.true;
                const tile = tilePool.getTile("TestTile");
                expect(tile).to.be.an.instanceOf(Tile);
                expect(tile.toString()).to.equal(validTileToString);
                expect(tilePool.toString()).to.equal(validTilePoolToString);
            });
        });

        context("when there isn't a Tile with the given id in the TilePool", function () {
            it("should throw an error", function () {
                const tilePool = new TilePool(validPuzzleData.totalNumberOfTiles, validPuzzleData.tiles);
                expect(function () {
                    tilePool.getTile("TestTile");
                }).to.throw(Error, "Tile (TestTile) not found in pool!");
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
            it("should return a random Tile from those remaining", function () {
                const tilePool = new TilePool(validPuzzleData.totalNumberOfTiles, validPuzzleData.tiles);
                expect(tilePool.randomTile).to.be.an.instanceOf(Tile);
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
