import { Face } from "../../src/js/face";
import { TilePosition } from '../../src/js/tile-position';
import { assert, expect} from 'chai';
import 'mocha';
// @ts-ignore
import {TILE_1, TILE_2, ONE_TILE_POSITION_DATA} from "./common-test-data";


describe("TilePosition behaviour", function () {

    describe("if a new TilePosition is created", function () {

        context("with a valid identifier", function () {
            const tilePosition = new TilePosition("XYZ", "1");
            it("should return a correctly initialised instance", function () {
                expect(tilePosition).to.be.an.instanceOf(TilePosition);
            });
            it("should not be holding a Tile", function () {
                expect(tilePosition.isEmpty());
            })
            it("should return the correct toString result", function () {
                const expectedToString = "TilePosition: XYZ, On Face: 1, Contains Tile: [null], Joins: ";
                expect(tilePosition.toString()).to.equal(expectedToString);
            })
        });

    });

    describe("if #getTile is called to get the details of a Tile", function () {

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

        const tilePosition1 = new TilePosition("TP1", "1");
        const tilePosition2 = new TilePosition("TP2", "1");
        const faceWithOneTilePosition = new Face("1", 1, ONE_TILE_POSITION_DATA);

        context("with valid side names for the two different TilePositions to be joined", function () {
            tilePosition1.join("A", "B", tilePosition2, faceWithOneTilePosition);
            it("should join the TilePositions in the direction given", function () {
                const tile1ExpectedToString = "TilePosition: TP1, On Face: 1, Contains Tile: [null], Joins: (TP1-A->1-TP2-B)";
                expect(tilePosition1.toString()).to.equal(tile1ExpectedToString);
            });
            it("should not join the TilePositions in the opposite direction", function () {
                const tile2ExpectedToString = "TilePosition: TP2, On Face: 1, Contains Tile: [null], Joins: ";
                expect(tilePosition2.toString()).to.equal(tile2ExpectedToString);
            });
        });

        context("where the TilePosition to join to is the same as the TilePosition you are joining from", function () {
            it("should throw an error", function () {
                expect(function () {
                    tilePosition1.join("A", "B", tilePosition1, faceWithOneTilePosition);
                }).to.throw(Error, "Cannot join a TilePosition to itself!");
            });
        });

        context("where the side name to join from is invalid", function () {
            it("should throw an error", function () {
                expect(function () {
                    tilePosition1.join("1", "A", tilePosition2, faceWithOneTilePosition);
                }).to.throw(Error, "Side to join from must be one of A,B,C!");
            });
        });

        context("where the side name to join to is invalid", function () {
            it("should throw an error", function () {
                expect(function () {
                    tilePosition1.join("A", "X", tilePosition2, faceWithOneTilePosition);
                }).to.throw(Error, "Side to join to must be one of A,B,C!");
            });
        });

    });

    describe("if #isEmpty() is called to test if there is already a Tile at this Position", function () {

        context("and the Position is empty", function () {
            const tilePosition = new TilePosition("TP", "1");
            it("should return True", function () {
                expect(tilePosition.isEmpty()).to.be.true;
            });
        });

        context("and the Position is already occupied by a Tile", function () {
            const tilePosition = new TilePosition("TP", "1");
            assert.isNotNull(tilePosition.placeTile(TILE_1));
            it("should return False", function () {
                expect(tilePosition.isEmpty()).to.be.false;
            });
        });

    });

    describe("if #placeTile() is called to place a Tile (without using matching)", function () {

        context("and the Position is empty", function () {
            const tilePosition = new TilePosition("TP", "1");
            const result = tilePosition.placeTile(TILE_1);
            it("should be placed", function () {
                expect(tilePosition.tile).to.equal(TILE_1);
            });
            it("should not return null", function () {
                expect(result).to.not.be.null;
            });
            it("should return the updated Position", function () {
                expect(result).to.be.an.instanceOf(TilePosition);
                expect(result.tile).to.equal(TILE_1);
            });
        });

        context("and the Position is already occupied by a Tile", function () {
            const tilePosition = new TilePosition("TP", "1");
            assert.isNotNull(tilePosition.placeTile(TILE_1));
            it("should throw an error", function () {
                expect(function () {
                    tilePosition.placeTile(TILE_2);
                }).to.throw(Error, "Can't place a Tile when the position is already filled!");
            });
            it("should not be placed", function () {
                expect(tilePosition.tile).to.equal(TILE_1);
            });
        });

    });

    describe("if #removeTile() is called to remove a Tile", function () {

        context("and the Position is empty", function () {
            const tilePosition = new TilePosition("TP", "1");
            const result = tilePosition.removeTile();
            it("should remain empty", function () {
                expect(tilePosition.isEmpty()).to.be.true;
            });
            it("should return False", function () {
                expect(result).to.be.false;
            });
        });

        context("and the Position has a Tile in it", function () {
            const tilePosition = new TilePosition("TP", "1");
            assert.isNotNull(tilePosition.placeTile(TILE_1));
            const result = tilePosition.removeTile();
            it("should remove the Tile", function () {
                expect(tilePosition.isEmpty()).to.be.true;
            });
            it("should return True", function () {
                expect(result).to.be.true;
            });
        });

    });

    describe("if #matches() is called to check if the current Tile sides match with surrounding Tiles", function () {

        context("and the Position is empty", function () {
            const tilePosition = new TilePosition("TP", "1");
            it("should throw an error", function () {
                expect(function () {
                    tilePosition.matches();
                }).to.throw(Error, "Can't check if a Position matches when there is no Tile to match from!");
            });
        });

        context("and the Position has a Tile in it with no surrounding Tiles", function () {
            const tilePosition = new TilePosition("TP", "1");
            const result = tilePosition.matches();
            it("should return true", function () {
                expect(result).to.be.true;
            });
        });

        context("and the Position has a Tile in it with one surrounding Tile which doesn't match", function () {
            const tilePosition = new TilePosition("TP", "1");
            const result = tilePosition.matches();
            it("should return false", function () {
                expect(result).to.be.false;
            });
        });

        context("and the Position has a Tile in it with one surrounding Tile which matches", function () {
            const tilePosition = new TilePosition("TP", "1");
            const result = tilePosition.matches();
            it("should return true", function () {
                expect(result).to.be.true;
            });
        });

        context("and the Position has a Tile in it with surrounding Tiles which don't match", function () {
            const tilePosition = new TilePosition("TP", "1");
            const result = tilePosition.matches();
            it("should return false", function () {
                expect(result).to.be.false;
            });
        });

        context("and the Position has a Tile in it with surrounding Tiles which all match", function () {
            const tilePosition = new TilePosition("TP", "1");
            const result = tilePosition.matches();
            it("should return true", function () {
                expect(result).to.be.true;
            });
        });

    });

});
