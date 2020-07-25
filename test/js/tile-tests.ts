import {Tile} from '../../src/js/tile';
import {TileDefinition} from "../../src/js/tile-data-schema";
import {Side} from "../../src/js/side";
import {expect} from 'chai';
import 'mocha';
// @ts-ignore
import {TILE_1_DATA, TILE_2_DATA, TILE_3_DATA, TILE_4_DATA} from "./common-test-data";


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
                const expectedToString = "Id: 101, Rotation: 0, Side-A: 1010, Side-B: 0010, Side-C: 0010";
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

    describe("if #place() is called on a Tile", function () {

        context("and the Tile has not been rotated", function () {
            const tile = new Tile(TILE_1_DATA);
            const expectedSegments = tile.getSegments();
            tile.placed();
            it("should not affect the Tile", function () {
                expect(tile.getSegments()).to.equal(expectedSegments);
            });
        });

        context("and the Tile has been rotated", function () {
            const tile = new Tile(TILE_1_DATA);
            const expectedSegments = tile.getSegments();
            tile.rotate();
            tile.placed();
            it("should reset the rotation", function () {
                expect(tile.getSegments()).to.equal(expectedSegments);
            });
        });

    });

    describe("if #rotate() is called on a Tile", function () {

        context("with a newly placed Tile", function () {
            const tile = new Tile(TILE_1_DATA);
            tile.placed();
            const result = tile.rotate();
            it("should return true", function () {
                expect(result).to.be.true;
            });
            it("should track the Tile as being rotated once", function () {
                const expectedSegments = TILE_1_DATA.sideC + TILE_1_DATA.sideA + TILE_1_DATA.sideB;
                expect(tile.getSegments()).to.equal(expectedSegments);
            });
        });

        context("and the Tile has already been rotated twice", function () {
            const tile = new Tile(TILE_1_DATA);
            tile.placed();
            tile.rotate();
            tile.rotate();
            const result = tile.rotate();
            it("should return false", function () {
                expect(result).to.be.false;
            });
            it("should reset the rotation back to 0", function () {
                const expectedSegments = TILE_1_DATA.sideA + TILE_1_DATA.sideB + TILE_1_DATA.sideC;
                expect(tile.getSegments()).to.equal(expectedSegments);
            });
        });

    });

    describe("if #getSideSegments() is called to get the segments for a side", function () {

        context("with argument SideA and the Tile hasn't been rotated", function () {
            const tile = new Tile(TILE_3_DATA);
            it("should return the segment coding for SideA", function () {
                expect(tile.getSideSegments(Side.SideA)).to.equal(TILE_3_DATA.sideA);
            });
        });

        context("with argument SideB and the Tile hasn't been rotated", function () {
            const tile = new Tile(TILE_3_DATA);
            it("should return the segment coding for SideB", function () {
                expect(tile.getSideSegments(Side.SideB)).to.equal(TILE_3_DATA.sideB);
            });
        });

        context("with argument SideC and the Tile hasn't been rotated", function () {
            const tile = new Tile(TILE_3_DATA);
            it("should return the segment coding for SideC", function () {
                expect(tile.getSideSegments(Side.SideC)).to.equal(TILE_3_DATA.sideC);
            });
        });

    });

    describe("if #getSegments() is called to get the rotated segment codings", function () {

        context("with a newly placed Tile", function () {
            const tile = new Tile(TILE_1_DATA);
            tile.placed();
            const expectedSegments = TILE_1_DATA.sideA + TILE_1_DATA.sideB + TILE_1_DATA.sideC;
            it("should return the segments in their initial position", function () {
                expect(tile.getSegments()).to.equal(expectedSegments);
            });
        });

        context("and the TilePosition has been rotated once", function () {
            const tile = new Tile(TILE_2_DATA);
            tile.placed();
            tile.rotate();
            const expectedSegments = TILE_2_DATA.sideC + TILE_2_DATA.sideA + TILE_2_DATA.sideB;
            it("should return the segments rotated once", function () {
                expect(tile.getSegments()).to.equal(expectedSegments);
            });
        });

    });

    describe("if #getSideSegmentsToMatchWith() is called to get a matching side segments", function () {

        context("with a newly placed Tile", function () {
            const tile = new Tile(TILE_1_DATA);
            tile.placed();
            const expectedSegments = TILE_1_DATA.sideA.split("").reverse().join("");
            it("should return the segments for the side reversed", function () {
                expect(tile.getSideSegmentsToMatchWith(Side.SideA)).to.equal(expectedSegments);
            });
        });

        context("with a rotated Tile", function () {
            const tile = new Tile(TILE_4_DATA);
            tile.placed();
            tile.rotate();
            const expectedSegments = TILE_4_DATA.sideC.split("").reverse().join("");
            it("should return the segments for the side reversed", function () {
                expect(tile.getSideSegmentsToMatchWith(Side.SideA)).to.equal(expectedSegments);
            });
        });

    });

    describe("if '#hasSideSegments() is called to test if a Tile has the supplied side segments", function () {

        context("and the Tile doesn't have the side segments", function () {
            const tile3 = new Tile(TILE_3_DATA);
            tile3.placed();
            const tile4 = new Tile(TILE_4_DATA);
            tile4.placed();
            const findSegments = [tile4.getSideSegmentsToMatchWith(Side.SideA)];
            it("should return false", function () {
                expect(tile3.hasSideSegments(findSegments)).to.be.false;
            });
        });

        context("and the Tile has the side segments", function () {
            const tile3 = new Tile(TILE_3_DATA);
            tile3.placed();
            const tile4 = new Tile(TILE_4_DATA);
            tile4.placed();
            const findSegments = [tile4.getSideSegmentsToMatchWith(Side.SideC)];
            it("should return true", function () {
                expect(tile3.hasSideSegments(findSegments)).to.be.true;
            });
        });

    });

});
