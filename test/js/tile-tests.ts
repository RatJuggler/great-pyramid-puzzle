import { Tile } from '../../src/js/tile';
import { TileDefinition } from "../../src/js/tile-data-schema";
import { Side } from "../../src/js/side";
import { assert, expect } from 'chai';
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
                const expectedToString = "Id: 101, Side-A: 1010, Side-B: 0010, Side-C: 0010, Orientation: 0";
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

        context("with argument SideA and the Tile orientation unchanged", function () {
            const tile = new Tile(TILE_3_DATA);
            it("should return the segment coding for SideA", function () {
                expect(tile.getSideSegements(Side.SideA)).to.equal(TILE_3_DATA.sideA);
            });
        });

        context("with argument SideA and the Tile rotated once", function () {
            const tile = new Tile(TILE_3_DATA);
            assert.strictEqual(tile.nextOrientation(), tile);
            it("should return the segment coding for SideC", function () {
                expect(tile.getSideSegements(Side.SideA)).to.equal(TILE_3_DATA.sideC);
            });
        });

        context("with argument SideA and the Tile rotated twice", function () {
            const tile = new Tile(TILE_3_DATA);
            assert.strictEqual(tile.nextOrientation(), tile);
            assert.strictEqual(tile.nextOrientation(), tile);
            it("should return the segment coding for SideB", function () {
                expect(tile.getSideSegements(Side.SideA)).to.equal(TILE_3_DATA.sideB);
            });
        });

        context("with argument SideA and the Tile rotated three times", function () {
            const tile = new Tile(TILE_3_DATA);
            assert.strictEqual(tile.nextOrientation(), tile);
            assert.strictEqual(tile.nextOrientation(), tile);
            assert.strictEqual(tile.nextOrientation(), tile);
            it("should return the segment coding for SideA", function () {
                expect(tile.getSideSegements(Side.SideA)).to.equal(TILE_3_DATA.sideA);
            });
        });

    });

    describe("if #getSegments() is called to get all the segment codings", function () {

        context("on a newly created Tile", function () {
            const tile = new Tile(TILE_1_DATA);
            const expectedReturn = TILE_1_DATA.sideA + TILE_1_DATA.sideB + TILE_1_DATA.sideC;
            it("should return a string of the initial segment codings", function () {
                expect(tile.segments).to.equal(expectedReturn);
            });
        });

        context("on a Tile which has been rotated twice", function () {
            const tile = new Tile(TILE_1_DATA);
            assert.strictEqual(tile.nextOrientation(), tile);
            assert.strictEqual(tile.nextOrientation(), tile);
            const expectedReturn = TILE_1_DATA.sideB + TILE_1_DATA.sideC + TILE_1_DATA.sideA;
            it("should return a string of the rotated segment codings", function () {
                expect(tile.segments).to.equal(expectedReturn);
            });
        });

    });

    describe("if #placeTile() is called on a Tile", function () {

        context("and the orientation has not been changed", function () {
            const tile = new Tile(TILE_1_DATA);
            const expectedToString = tile.toString();
            it("should return the tile unchanged", function () {
                expect(tile.place().toString()).to.equal(expectedToString);
            })
        });

        context("and the orientation has been changed", function () {
            const tile = new Tile(TILE_1_DATA);
            assert.strictEqual(tile.nextOrientation(), tile);
            const expectedToString = tile.toString();
            it("should return the tile with the orientation reset", function () {
                expect(tile.place().toString()).to.not.equal(expectedToString);
            })
        });

    });

    describe("if #nextOrientation() is called on a Tile", function () {

        context("and the the Tile is newly placed", function () {
            const tile = new Tile(TILE_1_DATA);
            const expectedReturn = TILE_1_DATA.sideC + TILE_1_DATA.sideA + TILE_1_DATA.sideB;
            const result = tile.nextOrientation();
            it("should update to the next orientation", function () {
                expect(tile.segments).to.equal(expectedReturn);
            });
            it("should return the same Tile instance", function () {
                expect(result).to.equal(tile);
            });
        });

        context("and the Tile has already had the Orientation changed twice", function () {
            const tile = new Tile(TILE_1_DATA);
            assert.strictEqual(tile.nextOrientation(), tile);
            assert.strictEqual(tile.nextOrientation(), tile);
            const expectedReturn = TILE_1_DATA.sideA + TILE_1_DATA.sideB + TILE_1_DATA.sideC;
            const result = tile.nextOrientation();
            it("should update to the initial orientation", function () {
                expect(tile.segments).to.equal(expectedReturn);
            });
            it("should return the same Tile instance", function () {
                expect(result).to.equal(tile);
            });
        });

    });

});
