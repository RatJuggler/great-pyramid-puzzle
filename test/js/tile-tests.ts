import { Tile } from '../../src/js/tile';
import { TileDefinition } from "../../src/js/tile-data-schema";
import { Side } from "../../src/js/side";
import { expect } from 'chai';
import 'mocha';
// @ts-ignore
import { TILE_1_DATA, TILE_3_DATA } from "./common-test-data";


describe("Tile behaviour", function () {

    describe("if a new Tile is created", function () {

        context("with valid Tile data", function () {
            const tile = new Tile(TILE_1_DATA);
            it("should return a correctly initialised instance", function () {
                expect(tile).to.be.an.instanceOf(Tile);
            });
            it("with the id set correctly", function () {
                expect(tile.id).to.equal(TILE_1_DATA.tile);
            });
            it("should also return the correct toString result from this instance", function () {
                const expectedToString = "Id: 101, Side-A: 1010, Side-B: 0010, Side-C: 0010";
                expect(tile.toString()).to.equal(expectedToString);
            });
        });

        context("with an invalid Tile segment data length", function () {
            it("should throw an error", function () {
                const invalidTileData: TileDefinition = {
                    "tile": 0,
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
                const invalidTileData: TileDefinition = {
                    "tile": 0,
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

    describe("if #getSideSegments() is called to get the segments for a side", function () {

        context("with argument SideA", function () {
            const tile = new Tile(TILE_3_DATA);
            it("should return the segment coding for SideA", function () {
                expect(tile.getSideSegments(Side.SideA)).to.equal(TILE_3_DATA.sideA);
            });
        });

        context("with argument SideB", function () {
            const tile = new Tile(TILE_3_DATA);
            it("should return the segment coding for SideB", function () {
                expect(tile.getSideSegments(Side.SideB)).to.equal(TILE_3_DATA.sideB);
            });
        });

        context("with argument SideC", function () {
            const tile = new Tile(TILE_3_DATA);
            it("should return the segment coding for SideC", function () {
                expect(tile.getSideSegments(Side.SideC)).to.equal(TILE_3_DATA.sideC);
            });
        });

    });

    describe("if #getSegments() is called to get all the segment codings", function () {

        context("with arguments SideA, SideB & SideC", function () {
            const tile = new Tile(TILE_1_DATA);
            const expectedReturn = TILE_1_DATA.sideA + TILE_1_DATA.sideB + TILE_1_DATA.sideC;
            it("should return a string of the side segments in that order", function () {
                expect(tile.getSegments(Side.SideA, Side.SideB, Side.SideC)).to.equal(expectedReturn);
            });
        });

        context("with arguments SideC, SideA & SideB", function () {
            const tile = new Tile(TILE_1_DATA);
            const expectedReturn = TILE_1_DATA.sideC + TILE_1_DATA.sideA + TILE_1_DATA.sideB;
            it("should return a string of the side segments in that order", function () {
                expect(tile.getSegments(Side.SideC, Side.SideA, Side.SideB)).to.equal(expectedReturn);
            });
        });

        context("with argumen\ts SideB, SideC & SideA", function () {
            const tile = new Tile(TILE_1_DATA);
            const expectedReturn = TILE_1_DATA.sideB + TILE_1_DATA.sideC + TILE_1_DATA.sideA;
            it("should return a string of the side segments in that order", function () {
                expect(tile.getSegments(Side.SideB, Side.SideC, Side.SideA)).to.equal(expectedReturn);
            });
        });

    });

});
