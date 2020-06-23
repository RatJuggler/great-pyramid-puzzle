import * as valid_config1 from "../valid-test-puzzle-data1.json";
import * as invalid_config1 from "../invalid-test-puzzle-data1.json";
import { Tile } from "../../src/js/tile";
import { TilePool } from '../../src/js/tile-pool';
import { expect } from 'chai';
import 'mocha';


describe("TilePool behavior", () => {

    describe("if a new TilePool is created", () => {

        context("with valid configuration data file 1", () => {
            it("should return a correctly initialised instance", () => {
                const puzzleData = valid_config1.testPuzzleData;
                const tilePool = new TilePool(puzzleData.totalNumberOfTiles, puzzleData.tiles);
                expect(tilePool).to.be.an.instanceOf(TilePool);
            });
        });

        context("with invalid configuration data file 1", () => {
            it("should throw an error", () => {
                const puzzleData = invalid_config1.testPuzzleData;
                expect(() => {
                    new TilePool(puzzleData.totalNumberOfTiles, puzzleData.tiles);
                }).to.throw(Error, "Number of tiles provided (0) does not match number expected (64)!");
            });
        });

    });

    describe("selecting a random tile from the TilePool", () => {

        context("when there are tiles remaining", () => {
            it("should return a tile", () => {
                const puzzleData = valid_config1.testPuzzleData;
                const tilePool = new TilePool(puzzleData.totalNumberOfTiles, puzzleData.tiles);
                const tile = tilePool.getRandomTile();
                expect(tile).to.be.an.instanceOf(Tile);
            });
        });

        context("when there are no more tiles remaining", () => {
            it("should return null", () => {
                const puzzleData = valid_config1.testPuzzleData;
                const tilePool = new TilePool(puzzleData.totalNumberOfTiles, puzzleData.tiles);
                for (let i = 0; i < puzzleData.totalNumberOfTiles; i++) {
                    tilePool.getRandomTile();
                }
                const tile = tilePool.getRandomTile();
                expect(tile).to.be.null;
            });
        });

    });

});
