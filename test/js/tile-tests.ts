import { Tile } from '../../src/js/tile';
import { TileDefinition } from "../../src/js/tile-data-schema";
import { assert, expect } from 'chai';
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
                const expectedToString = "Id: 101, Side-A: 0001, Side-B: 0010, Side-C: 0100, Orientation: 0";
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

    describe("if #getSegments() is called to get all the segment codings", function () {

        context("on a newly created Tile", function () {
            const tile = new Tile(TILE_1_DATA);
            it("should return a string of the initial segment codings", function () {
                expect(tile.segments).to.equal("000100100100");
            });
        });

        context("on a Tile where the orientation has changed twice", function () {
            const tile = new Tile(TILE_1_DATA);
            assert.strictEqual(tile.nextOrientation(), tile);
            assert.strictEqual(tile.nextOrientation(), tile);
            it("should return a string of all the segment codings", function () {
                expect(tile.segments).to.equal("001001000001");
            });
        });

    });

    describe("if #nextOrientation() is called on a Tile", function () {

        context("and the the Tile is newly placed", function () {
            const tile = new Tile(TILE_1_DATA);
            const result = tile.nextOrientation();
            it("should update to the next orientation", function () {
                expect(tile.segments).to.equal("010000010010");
            });
            it("should return the same Tile instance", function () {
                expect(result).to.equal(tile);
            });
        });

        context("and the Tile has already had the Orientation changed twice", function () {
            const tile = new Tile(TILE_1_DATA);
            assert.strictEqual(tile.nextOrientation(), tile);
            assert.strictEqual(tile.nextOrientation(), tile);
            const result = tile.nextOrientation();
            it("should update to the initial orientation", function () {
                expect(tile.segments).to.equal("000100100100");
            });
            it("should return the same Tile instance", function () {
                expect(result).to.equal(tile);
            });
        });

    });

});
