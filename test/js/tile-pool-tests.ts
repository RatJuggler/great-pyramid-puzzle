import * as valid_config1 from "../valid-test-puzzle-data1.json";
import * as invalid_config1 from "../invalid-test-puzzle-data1.json";
import { TilePool } from '../../src/js/tile-pool';
import { expect } from 'chai';
import 'mocha';

describe("TilePool behavior", () => {

    describe("if a new TilePool is created", () => {

        context("with valid configuration data", () => {
            it("should return a correctly initialised instance", () => {
                const puzzleData = valid_config1.testPuzzleData;
                const tilePool = new TilePool(puzzleData.totalNumberOfTiles, puzzleData.tiles);
                expect(tilePool).to.be.an.instanceOf(TilePool);
            });
        });

        context("with invalid configuration data", () => {
            it("should throw an error", () => {
                const puzzleData = invalid_config1.testPuzzleData;
                expect(() => {
                    new TilePool(puzzleData.totalNumberOfTiles, puzzleData.tiles);
                }).to.throw(Error, "Number of tiles provided (0) does not match number expected (64)!");
            });
        });

    });

});