import * as valid_config1 from "../valid-test-puzzle-data1.json";
import * as invalid_config1 from "../invalid-test-puzzle-data1.json";
import { Tile } from "../../src/js/tile";
import { TilePool } from '../../src/js/tile-pool';
import { expect } from 'chai';
import 'mocha';


describe("TilePool behavior", () => {

    const puzzleData = valid_config1.testPuzzleData;

    describe("if a new TilePool is created", () => {

        context("with a valid configuration data file 1", () => {
            it("should return a correctly initialised instance", () => {
                const tilePool = new TilePool(puzzleData.totalNumberOfTiles, puzzleData.tiles);
                expect(tilePool).to.be.an.instanceOf(TilePool);
            });
        });

        context("with an invalid configuration data file 1", () => {
            it("should throw an error", () => {
                const puzzleData = invalid_config1.testPuzzleData;
                expect(() => {
                    new TilePool(puzzleData.totalNumberOfTiles, puzzleData.tiles);
                }).to.throw(Error, "Number of tiles provided (0) does not match number expected (64)!");
            });
        });

    });

    describe("selecting a random Tile from the TilePool", () => {

        context("when there are Tiles remaining in the TilePool", () => {
            it("should return a random Tile", () => {
                const tilePool = new TilePool(puzzleData.totalNumberOfTiles, puzzleData.tiles);
                const tile = tilePool.randomTile;
                expect(tile).to.be.an.instanceOf(Tile);
            });
        });

        context("when there are no Tiles remaining in the TilePool", () => {
            it("should return undefined", () => {
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
