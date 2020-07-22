import {TilePosition} from '../../src/js/tile-position';
import { Side } from "../../src/js/side";
import {assert, expect} from 'chai';
import 'mocha';
// @ts-ignore
import { TILE_1, TILE_2, TILE_3, TILE_4} from "./common-test-data";


describe("TilePosition behaviour", function () {

    describe("when a new TilePosition is first created", function () {

        context("without joining to any other TilePositions", function () {
            const tilePosition = new TilePosition("XYZ", "1");
            it("should return a correctly initialised instance", function () {
                expect(tilePosition).to.be.an.instanceOf(TilePosition);
            });
            it("should not be holding a Tile", function () {
                expect(tilePosition.isEmpty());
            });
            it("should return the correct toString result", function () {
                const expectedToString = "TilePosition: XYZ, On Face: 1, Contains Tile: [Empty], Rotated: 0, Joins: ";
                expect(tilePosition.toString()).to.equal(expectedToString);
            });
            it("should fail the integrity check", function () {
                const expectedFailure =
                    [false, "Tile position joins not complete: TilePosition: XYZ, On Face: 1, Contains Tile: [Empty], Rotated: 0, Joins: "];
                expect(tilePosition.integrityCheck()).to.eql(expectedFailure)
            });
        });

        context("and then joined to three other TilePositions", function () {
            const tilePosition = new TilePosition("XYZ", "1");
            const tilePosition1 = new TilePosition("TP1", "1");
            const tilePosition2 = new TilePosition("TP2", "1");
            const tilePosition3 = new TilePosition("TP3", "1");
            tilePosition.join("A", "B", tilePosition1);
            tilePosition.join("B", "C", tilePosition2);
            tilePosition.join("C", "A", tilePosition3);
            it("should not be holding a Tile", function () {
                expect(tilePosition.isEmpty());
            });
            it("should return the correct toString result", function () {
                const expectedToString =
                    "TilePosition: XYZ, On Face: 1, Contains Tile: [Empty], Rotated: 0, Joins: (XYZ-A->1-TP1-B)(XYZ-B->1-TP2-C)(XYZ-C->1-TP3-A)";
                expect(tilePosition.toString()).to.equal(expectedToString);
            });
            it("should pass the integrity check", function () {
                expect(tilePosition.integrityCheck()).to.eql([true, "Passed"]);
            });
        });

    });

    describe("if #getTile() is called to get the details of a Tile", function () {

        context("on a TilePosition which has a Tile in it", function () {
            const tilePosition = new TilePosition("TP", "1");
            assert.isNotNull(tilePosition.placeTile(TILE_1));
            it("should return the Tile", function () {
                expect(tilePosition.tile).to.equal(TILE_1);
            });
        });

        context("on a TilePosition which doesn't have a Tile in it", function () {
            const tilePosition = new TilePosition("TP", "1");
            it("should return throw an error", function () {
                expect(function () {
                    tilePosition.tile;
                }).to.throw(Error, "Can't fetch a Tile when there isn't one!");
            });
        });

    });

    describe("if #join() is called to join one TilePosition to another", function () {

        context("with valid side names for the two different TilePositions to be joined", function () {
            const tilePosition1 = new TilePosition("TP1", "1");
            const tilePosition2 = new TilePosition("TP2", "1");
            tilePosition1.join("A", "B", tilePosition2);
            it("should join the TilePositions in the direction given", function () {
                const tile1ExpectedToString = "TilePosition: TP1, On Face: 1, Contains Tile: [Empty], Rotated: 0, Joins: (TP1-A->1-TP2-B)";
                expect(tilePosition1.toString()).to.equal(tile1ExpectedToString);
            });
            it("should not join the TilePositions in the opposite direction", function () {
                const tile2ExpectedToString = "TilePosition: TP2, On Face: 1, Contains Tile: [Empty], Rotated: 0, Joins: ";
                expect(tilePosition2.toString()).to.equal(tile2ExpectedToString);
            });
        });

        context("where the TilePosition to join to is the same as the one you are joining from", function () {
            const tilePosition1 = new TilePosition("TP1", "1");
            it("should throw an error", function () {
                expect(function () {
                    tilePosition1.join("A", "B", tilePosition1);
                }).to.throw(Error, "Cannot join a TilePosition to itself!");
            });
        });

        context("where the side name to join from is invalid", function () {
            const tilePosition1 = new TilePosition("TP1", "1");
            const tilePosition2 = new TilePosition("TP2", "1");
            it("should throw an error", function () {
                expect(function () {
                    tilePosition1.join("1", "A", tilePosition2);
                }).to.throw(Error, "Side to join from must be one of A,B,C!");
            });
        });

        context("where the side name to join to is invalid", function () {
            const tilePosition1 = new TilePosition("TP1", "1");
            const tilePosition2 = new TilePosition("TP2", "1");
            it("should throw an error", function () {
                expect(function () {
                    tilePosition1.join("A", "X", tilePosition2);
                }).to.throw(Error, "Side to join to must be one of A,B,C!");
            });
        });

        context("where there is already a join for the side given", function () {
            const tilePosition1 = new TilePosition("TP1", "1");
            const tilePosition2 = new TilePosition("TP2", "1");
            const tilePosition3 = new TilePosition("TP3", "1");
            tilePosition1.join("A", "B", tilePosition2);
            it("should throw an error", function () {
                expect(function () {
                    tilePosition1.join("A", "B", tilePosition3);
                }).to.throw(Error, "Existing join already present for side A!");
            })
        })

        context("where the TilePosition is already joined to three others", function () {
            const tilePosition = new TilePosition("TP", "1");
            const tilePosition1 = new TilePosition("TP1", "1");
            const tilePosition2 = new TilePosition("TP2", "1");
            const tilePosition3 = new TilePosition("TP3", "1");
            const tilePosition4 = new TilePosition("TP4", "1");
            tilePosition.join("A", "B", tilePosition1);
            tilePosition.join("B", "C", tilePosition2);
            tilePosition.join("C", "A", tilePosition3);
            it("should throw an error", function () {
                expect(function () {
                    tilePosition.join("A", "A", tilePosition4);
                }).to.throw(Error, "TilePositions can only join to three other TilePositions!");
            })
        })

    });

    describe("if #isEmpty() is called to test if there is already a Tile at this TilePosition", function () {

        context("and the TilePosition is empty", function () {
            const tilePosition = new TilePosition("TP", "1");
            it("should return True", function () {
                expect(tilePosition.isEmpty()).to.be.true;
            });
        });

        context("and the TilePosition is already occupied by a Tile", function () {
            const tilePosition = new TilePosition("TP", "1");
            assert.isNotNull(tilePosition.placeTile(TILE_1));
            it("should return False", function () {
                expect(tilePosition.isEmpty()).to.be.false;
            });
        });

    });

    describe("if #placeTile() is called to place a Tile (without using matching)", function () {

        context("and the TilePosition is empty", function () {
            const tilePosition = new TilePosition("TP", "1");
            const result = tilePosition.placeTile(TILE_1);
            it("should return the updated TilePosition", function () {
                expect(result).to.be.an.instanceOf(TilePosition);
            });
            it("with the Tile placed", function () {
                expect(result.tile).to.equal(TILE_1);
            });
            it("and the rotation as 0", function () {
                const expectedTileSegments = TILE_1.getSegments(Side.SideA, Side.SideB, Side.SideC);
                expect(result.getRotatedSegments()).to.equal(expectedTileSegments);
            })
        });

        context("and the TilePosition is already occupied by a Tile", function () {
            const tilePosition = new TilePosition("TP", "1");
            assert.isNotNull(tilePosition.placeTile(TILE_1));
            it("should throw an error", function () {
                expect(function () {
                    tilePosition.placeTile(TILE_2);
                }).to.throw(Error, "Can't place a Tile when the TilePosition is already filled!");
            });
            it("should not be placed", function () {
                expect(tilePosition.tile).to.equal(TILE_1);
            });
        });

    });

    describe("if #rotateTile() is called on a TilePosition", function () {

        context("with a newly placed Tile", function () {
            const tilePosition = new TilePosition("TP", "1");
            tilePosition.placeTile(TILE_1);
            const result = tilePosition.rotateTile();
            it("should return true", function () {
                expect(result).to.be.true;
            });
            it("should track the Tile as being rotated once", function () {
                const expectedTileSegments = TILE_1.getSegments(Side.SideC, Side.SideA, Side.SideB);
                expect(tilePosition.getRotatedSegments()).to.equal(expectedTileSegments);
            });
        });

        context("and the TilePosition has already been rotated twice", function () {
            const tilePosition = new TilePosition("TP", "1");
            tilePosition.placeTile(TILE_1);
            assert.isTrue(tilePosition.rotateTile());
            assert.isTrue(tilePosition.rotateTile());
            const result = tilePosition.rotateTile();
            it("should return false", function () {
                expect(result).to.be.false;
            });
            it("should reset the rotation back to 0", function () {
                const expectedTileSegments = TILE_1.getSegments(Side.SideA, Side.SideB, Side.SideC);
                expect(tilePosition.getRotatedSegments()).to.equal(expectedTileSegments);
            });
        });

    });

    describe("if #getRotatedSegments() is called to get the rotated segment codings", function () {

        context("with a newly placed Tile", function () {
            const tilePosition = new TilePosition("TP", "1");
            tilePosition.placeTile(TILE_2);
            it("should return the segments in their initial position", function () {
                const expectedTileSegments = TILE_2.getSegments(Side.SideA, Side.SideB, Side.SideC);
                expect(tilePosition.getRotatedSegments()).to.equal(expectedTileSegments);
            });
        });

        context("and the TilePosition has been rotated once", function () {
            const tilePosition = new TilePosition("TP", "1");
            tilePosition.placeTile(TILE_2);
            assert.isTrue(tilePosition.rotateTile());
            it("should return the segments rotated once", function () {
                const expectedTileSegments = TILE_2.getSegments(Side.SideC, Side.SideA, Side.SideB);
                expect(tilePosition.getRotatedSegments()).to.equal(expectedTileSegments);
            });
        });

    });

    describe("if #removeTile() is called to remove a Tile", function () {

        context("and the TilePosition is empty", function () {
            const tilePosition = new TilePosition("TP", "1");
            it("should throw an error", function () {
                expect(function () {
                    tilePosition.removeTile();
                }).to.throw(Error, "No Tile to remove!");
            });
        });

        context("and the TilePosition has a Tile in it", function () {
            const tilePosition = new TilePosition("TP", "1");
            assert.isNotNull(tilePosition.placeTile(TILE_1));
            const result = tilePosition.removeTile();
            it("should remove the Tile", function () {
                expect(tilePosition.isEmpty()).to.be.true;
            });
            it("should return Tile", function () {
                expect(result).to.eql(TILE_1);
            });
        });

    });

    describe("if #matches() is called to check if the Tile at a TilePosition matches with any surrounding Tiles", function () {

        const tilePosition1 = new TilePosition("TP1", "1");
        const tilePosition2 = new TilePosition("TP2", "2");
        const tilePosition3 = new TilePosition("TP3", "3");
        const tilePosition4 = new TilePosition("TP4", "4");
        tilePosition1.join("A", "B", tilePosition3);
        tilePosition1.join("B", "B", tilePosition4);
        tilePosition1.join("C", "B", tilePosition2);

        context("and the TilePosition being checked is empty", function () {
            it("should throw an error", function () {
                expect(function () {
                    tilePosition1.matches();
                }).to.throw(Error, "Can't check if a TilePosition matches when there is no Tile to match from!");
            });
        });

        context("and the TilePosition being checked has a Tile in it with no surrounding Tiles", function () {
            assert.isNotNull(tilePosition1.placeTile(TILE_1));
            const result = tilePosition1.matches();
            it("should return true", function () {
                expect(result).to.be.true;
            });
            assert.strictEqual(tilePosition1.removeTile(), TILE_1);
        });

        context("and there are two adjoining TilePositions, each with a Tile, but the sides don't match", function () {
            assert.isNotNull(tilePosition1.placeTile(TILE_1));
            assert.isNotNull(tilePosition3.placeTile(TILE_3));
            const result1 = tilePosition1.matches();
            const result3 = tilePosition3.matches();
            it("should return false for the first TilePosition", function () {
                expect(result1).to.be.false;
            });
            it("should return false for the second TilePosition", function () {
                expect(result3).to.be.false;
            });
            assert.strictEqual(tilePosition1.removeTile(), TILE_1);
            assert.strictEqual(tilePosition3.removeTile(), TILE_3);
        });

        context("and there are two adjoining TilePositions, each with a Tile, and the sides match", function () {
            assert.isNotNull(tilePosition1.placeTile(TILE_2));
            assert.isNotNull(tilePosition2.placeTile(TILE_3));
            const result1 = tilePosition1.matches();
            const result2 = tilePosition2.matches();
            it("should return true for the first TilePosition", function () {
                expect(result1).to.be.true;
            });
            it("should return true for the second TilePosition", function () {
                expect(result2).to.be.true;
            });
            assert.strictEqual(tilePosition1.removeTile(), TILE_2);
            assert.strictEqual(tilePosition2.removeTile(), TILE_3);
        });

        context("and there are four adjoining TilePositions, each with a Tile, but not all the sides match", function () {
            assert.isNotNull(tilePosition1.placeTile(TILE_2));
            assert.isNotNull(tilePosition2.placeTile(TILE_3));
            assert.isNotNull(tilePosition3.placeTile(TILE_1));
            assert.isNotNull(tilePosition4.placeTile(TILE_4));
            const result1 = tilePosition1.matches();
            const result2 = tilePosition2.matches();
            const result3 = tilePosition3.matches();
            const result4 = tilePosition4.matches();
            it("should return false for the first TilePosition", function () {
                expect(result1).to.be.false;
            });
            it("should return false for the second TilePosition", function () {
                expect(result2).to.be.false;
            });
            it("should return false for the third TilePosition", function () {
                expect(result3).to.be.false;
            });
            it("should return false for the fourth TilePosition", function () {
                expect(result4).to.be.false;
            });
            assert.strictEqual(tilePosition1.removeTile(), TILE_2);
            assert.strictEqual(tilePosition2.removeTile(), TILE_3);
            assert.strictEqual(tilePosition3.removeTile(), TILE_1);
            assert.strictEqual(tilePosition4.removeTile(), TILE_4);
        });

        context("and there are four adjoining TilePositions, each with a Tile, and all the sides match", function () {
            assert.isNotNull(tilePosition1.placeTile(TILE_2));
            assert.isNotNull(tilePosition2.placeTile(TILE_3));
            assert.isNotNull(tilePosition3.placeTile(TILE_1));
            assert.isTrue(tilePosition3.rotateTile());
            assert.isTrue(tilePosition3.rotateTile());
            assert.isNotNull(tilePosition4.placeTile(TILE_4));
            assert.isTrue(tilePosition4.rotateTile());
            const result1 = tilePosition1.matches();
            const result2 = tilePosition2.matches();
            const result3 = tilePosition3.matches();
            const result4 = tilePosition4.matches();
            it("should return true for the first TilePosition", function () {
                expect(result1).to.be.true;
            });
            it("should return true for the second TilePosition", function () {
                expect(result2).to.be.true;
            });
            it("should return true for the third TilePosition", function () {
                expect(result3).to.be.true;
            });
            it("should return true for the fourth TilePosition", function () {
                expect(result4).to.be.true;
            });
            assert.strictEqual(tilePosition1.removeTile(), TILE_2);
            assert.strictEqual(tilePosition2.removeTile(), TILE_3);
            assert.strictEqual(tilePosition3.removeTile(), TILE_1);
            assert.strictEqual(tilePosition4.removeTile(), TILE_4);
        });

    });

});
