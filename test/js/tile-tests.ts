import { Tile } from '../../src/js/tile';
import { TileData } from "../../src/js/puzzle-data-schema";
import { expect } from 'chai';
import 'mocha';
// @ts-ignore
import { TILE_1_DATA } from "./common-test-data";


describe("Tile behaviour", function () {

    describe("if a new Tile is created", function () {

        context("with valid Tile data", function () {
            const tile = new Tile(TILE_1_DATA);
            it("should return a correctly initialised instance", function () {
                expect(tile).to.be.an.instanceOf(Tile);
            });
            it("should also return the correct toString result from this instance", function () {
                const expectedToString = "Id: TestTile1, Side-A: 0001, Side-B: 0010, Side-C: 0100";
                expect(tile.toString()).to.equal(expectedToString);
            });
        });

        context("with an invalid Tile segment data length", function () {
            it("should throw an error", function () {
                const invalidTileData: TileData = {
                    "tile": "TestTile",
                    "sideA": "0001",
                    "sideB": "00010",
                    "sideC": "0100"
                };
                expect(function () {
                    new Tile(invalidTileData);
                }).to.throw(Error, "Segment coding should be four characters, found '00010'!");
            });
        });

        context("with an invalid Tile segment data coding", function () {
            it("should throw an error", function () {
                const invalidTileData: TileData = {
                    "tile": "TestTile",
                    "sideA": "0001",
                    "sideB": "0010",
                    "sideC": "01A0"
                };
                expect(function () {
                    new Tile(invalidTileData);
                }).to.throw(Error, "Segment coding can only contain '1' or '0', found '01A0'!");
            });
        });

    });

    describe("if #getSegments() is called to get all the segment codings", function () {

        context("", function () {
            const tile = new Tile(TILE_1_DATA);
            const segments = tile.segments;
            it("should return a string", function () {
                expect(typeof(segments)).to.equal('string');
            });
            it("should also be returning all of the segment codings", function () {
                expect(tile.segments).to.equal("000100100100");
            });
        });

    });

});
