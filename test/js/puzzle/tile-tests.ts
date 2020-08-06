import { Tile } from '../../../src/js/puzzle/tile';
import { TileDefinition } from "../../../src/js/puzzle/tile-data-schema";
import { Side } from "../../../src/js/puzzle/side";
import { expect } from 'chai';
import 'mocha';
// @ts-ignore
import { TILE_1_DATA, TILE_2_DATA, TILE_3_DATA, TILE_4_DATA } from "../common-test-data";


describe("Tile behaviour", function () {

    let tile1: Tile;
    let tile2: Tile;
    let tile3: Tile;
    let tile4: Tile;

    beforeEach(function () {
        tile1 = new Tile(TILE_1_DATA);
        tile2 = new Tile(TILE_2_DATA);
        tile3 = new Tile(TILE_3_DATA);
        tile4 = new Tile(TILE_4_DATA);
    });

    describe("if a new Tile is created", function () {

        context("with valid Tile data", function () {
            it("should return a correctly initialised instance", function () {
                expect(tile1).to.be.an.instanceOf(Tile);
            });
            it("with the id set correctly", function () {
                expect(tile1.id).to.equal(TILE_1_DATA.tile);
            });
            it("should also return the correct toString result from this instance", function () {
                const expectedToString = "Id: 101, Side-A: 1010, Side-B: 0010, Side-C: 0010";
                expect(tile1.toString()).to.equal(expectedToString);
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

    describe("if #getSegmentsForSide() is called to get the segments for a side on a Tile that hasn't been rotated", function () {

        context("with argument SideA", function () {
            it("should return the segment coding for SideA", function () {
                expect(tile3.getSegmentsForSide(0, Side.SideA)).to.equal(TILE_3_DATA.sideA);
            });
        });

        context("with argument SideB", function () {
            it("should return the segment coding for SideB", function () {
                expect(tile3.getSegmentsForSide(0, Side.SideB)).to.equal(TILE_3_DATA.sideB);
            });
        });

        context("with argument SideC", function () {
            it("should return the segment coding for SideC", function () {
                expect(tile3.getSegmentsForSide(0, Side.SideC)).to.equal(TILE_3_DATA.sideC);
            });
        });

    });

    describe("if #getSegmentsForSide() is called to get the segments for a side on a Tile that has been rotated once", function () {

        context("with argument SideA", function () {
            it("should return the segment coding for SideC", function () {
                expect(tile3.getSegmentsForSide(1, Side.SideA)).to.equal(TILE_3_DATA.sideC);
            });
        });

        context("with argument SideB", function () {
            it("should return the segment coding for SideA", function () {
                expect(tile3.getSegmentsForSide(1, Side.SideB)).to.equal(TILE_3_DATA.sideA);
            });
        });

        context("with argument SideC", function () {
            it("should return the segment coding for SideB", function () {
                expect(tile3.getSegmentsForSide(1, Side.SideC)).to.equal(TILE_3_DATA.sideB);
            });
        });

    });

    describe("if #getSegmentsForSide() is called to get the segments for a side on a Tile that has been rotated twice", function () {

        context("with argument SideA", function () {
            it("should return the segment coding for SideB", function () {
                expect(tile3.getSegmentsForSide(2, Side.SideA)).to.equal(TILE_3_DATA.sideB);
            });
        });

        context("with argument SideB", function () {
            it("should return the segment coding for SideC", function () {
                expect(tile3.getSegmentsForSide(2, Side.SideB)).to.equal(TILE_3_DATA.sideC);
            });
        });

        context("with argument SideC", function () {
            it("should return the segment coding for SideA", function () {
                expect(tile3.getSegmentsForSide(2, Side.SideC)).to.equal(TILE_3_DATA.sideA);
            });
        });

    });

    describe("if #getSegments() is called to get the segment codings", function () {

        context("for test Tile 2", function () {
            it("should return the segments", function () {
                const expectedSegments = TILE_2_DATA.sideA + TILE_2_DATA.sideB + TILE_2_DATA.sideC;
                expect(tile2.segments).to.equal(expectedSegments);
            });
        });

        context("for test Tile 3", function () {
            it("should return the segments as normal", function () {
                const expectedSegments = TILE_3_DATA.sideA + TILE_3_DATA.sideB + TILE_3_DATA.sideC;
                expect(tile3.segments).to.equal(expectedSegments);
            });
        });

    });

    describe("if #getSegmentsForSideToMatchWith() is called to get a matching side segments", function () {

        context("with a newly placed Tile", function () {
            it("should return the segments for the side reversed", function () {
                const expectedSegments = TILE_1_DATA.sideA.split("").reverse().join("");
                expect(tile1.getSegmentsForSideToMatchWith(0, Side.SideA)).to.equal(expectedSegments);
            });
        });

        context("with a rotated Tile", function () {
            it("should return the segments for the side reversed", function () {
                const expectedSegments = TILE_4_DATA.sideC.split("").reverse().join("");
                expect(tile4.getSegmentsForSideToMatchWith(1, Side.SideA)).to.equal(expectedSegments);
            });
        });

    });

    describe("if '#hasSideSegments() is called to test if a Tile has the supplied side segments", function () {

        context("and the Tile doesn't have the side segments", function () {
            it("should return an array with a length of 0", function () {
                const findSegments = tile4.getSegmentsForSideToMatchWith(0, Side.SideA) + "...." + "....";
                const result = tile3.hasSideSegments(findSegments);
                expect(result).to.be.an.instanceof(Array);
                expect(result.length).to.equal(0);
            });
        });

        context("and the Tile has the side segments", function () {
            it("should return an array with a length of 1", function () {
                const findSegments = "...." + "...." + tile4.getSegmentsForSideToMatchWith(0, Side.SideC);
                const result = tile3.hasSideSegments(findSegments);
                expect(result).to.be.an.instanceof(Array);
                expect(result.length).to.equal(1);
            });
        });

    });

});
