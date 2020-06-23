import * as valid_config1 from "../valid-test-puzzle-data1.json";
import * as invalid_config1 from "../invalid-test-puzzle-data1.json";
import { Tile } from "../../src/js/tile";
import { TilePool } from '../../src/js/tile-pool';
import { expect } from 'chai';
import 'mocha';


describe("TilePool behavior", function () {

    const puzzleData = valid_config1.testPuzzleData;

    describe("if a new TilePool is created", function () {

        context("with a valid configuration data file 1", function () {
            it("should return a correctly initialised instance", function () {
                const tilePool = new TilePool(puzzleData.totalNumberOfTiles, puzzleData.tiles);
                expect(tilePool).to.be.an.instanceOf(TilePool);
            });
        });

        context("with an invalid configuration data fil() =>e 1", function () {
            it("should throw an error", function () {
                const puzzleData = invalid_config1.testPuzzleData;
                expect(function () {
                    new TilePool(puzzleData.totalNumberOfTiles, puzzleData.tiles);
                }).to.throw(Error, "Number of tiles provided (0) does not match number expected (64)!");
            });
        });

    });

    describe("selecting a random Tile from the TilePool", function () {

        context("when there are Tiles remaining in the TilePool", function () {
            it("should return a random Tile", function () {
                const tilePool = new TilePool(puzzleData.totalNumberOfTiles, puzzleData.tiles);
                const tile = tilePool.randomTile;
                expect(tile).to.be.an.instanceOf(Tile);
            });
        });

        context("when there are no Tiles remaining in the TilePool", function () {
            it("should return undefined", function () {
                const tilePool = new TilePool(puzzleData.totalNumberOfTiles, puzzleData.tiles);
                for (let i = 0; i < puzzleData.totalNumberOfTiles; i++) {
                    expect(tilePool.randomTile).to.be.an.instanceOf(Tile);
                }
                const tile = tilePool.randomTile;
                expect(tile).to.be.undefined;
            });
        });

    });

});
