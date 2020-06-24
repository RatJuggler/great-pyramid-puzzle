import { TilePosition } from '../../src/js/tile-position';
import { TilePositionData } from "../../src/js/puzzle-data-schema";
import { Face } from "../../src/js/face";
import {assert, expect} from 'chai';
import 'mocha';


describe("TilePosition behaviour", function () {

    const oneTilePositions: TilePositionData[]  = [
        {"position": "1", "joins": []}
    ];
    const faceWithOneTilePosition = new Face("1", 1, oneTilePositions);

    describe("if a new TilePosition is created", function () {

        context("with a valid identifier", function () {
            it("should return a correctly initialised instance", function () {
                const tilePosition = new TilePosition("XYZ");
                expect(tilePosition).to.be.an.instanceOf(TilePosition);
                const expectedToString = "TilePosition: XYZ, Joins: ";
                expect(tilePosition.toString()).to.equal(expectedToString);
            });
        });

    });

    describe("if #join() is called to join one TilePosition to another", function () {

        const tile1 = new TilePosition("Tile1");
        const tile2 = new TilePosition("Tile2");

        context("with valid side names for the two different TilePositions to be joined", function () {
            tile1.join("A", "B", tile2, faceWithOneTilePosition);
            it("should join the TilePositions in the direction given", function () {
                const tile1ExpectedToString = "TilePosition: Tile1, Joins: (Tile1-A->1-Tile2-B)";
                expect(tile1.toString()).to.equal(tile1ExpectedToString);
            });
            it("should not join the TilePositions in the opposite direction", function () {
                const tile2ExpectedToString = "TilePosition: Tile2, Joins: ";
                expect(tile2.toString()).to.equal(tile2ExpectedToString);
            });
        });

        context("where the TilePosition to join to is the same as the TilePosition you are joining from", function () {
            it("should throw an error", function () {
                expect(function () {
                    tile1.join("A", "B", tile1, faceWithOneTilePosition);
                }).to.throw(Error, "Cannot join a TilePosition to itself!");
            });
        });

        context("where the side name to join from is invalid", function () {
            it("should throw an error", function () {
                expect(function () {
                    tile1.join("1", "A", tile2, faceWithOneTilePosition);
                }).to.throw(Error, "Side to join from must be one of A,B,C!");
            });
        });

        context("where the side name to join to is invalid", function () {
            it("should throw an error", function () {
                expect(function () {
                    tile1.join("A", "X", tile2, faceWithOneTilePosition);
                }).to.throw(Error, "Side to join to must be one of A,B,C!");
            });
        });

    });

    describe("if #placeTile() is called to place a Tile (without using matching)", function () {

        context("and the Position is empty", function () {
            it("should be placed and return True", function () {
                assert.fail("Test not implemented!");
            });
        });

        context("and the Position is already occupied by a Tile", function () {
            it("should not be place and return False", function () {
                assert.fail("Test not implemented!");
            });
        });

    });

});
