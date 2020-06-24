import { TilePosition } from '../../src/js/tile-position';
import { TileData, TilePositionData } from "../../src/js/puzzle-data-schema";
import { Tile } from "../../src/js/tile";
import { Face } from "../../src/js/face";
import { assert, expect} from 'chai';
import 'mocha';


describe("TilePosition behaviour", function () {

    const oneTilePositions: TilePositionData[]  = [
        {"position": "1", "joins": []}
    ];
    const faceWithOneTilePosition = new Face("1", 1, oneTilePositions);

    describe("if a new TilePosition is created", function () {

        context("with a valid identifier", function () {
            const tilePosition = new TilePosition("XYZ");
            it("should return a correctly initialised instance", function () {
                expect(tilePosition).to.be.an.instanceOf(TilePosition);
            });
            it("should not be holding a Tile", function () {
                expect(tilePosition.isEmpty());
            })
            it("should return the correct toString result", function () {
                const expectedToString = "TilePosition: XYZ, Contains Tile: [null], Joins: ";
                expect(tilePosition.toString()).to.equal(expectedToString);
            })
        });

    });

    describe("if #join() is called to join one TilePosition to another", function () {

        const tilePosition1 = new TilePosition("TP1");
        const tilePosition2 = new TilePosition("TP2");

        context("with valid side names for the two different TilePositions to be joined", function () {
            tilePosition1.join("A", "B", tilePosition2, faceWithOneTilePosition);
            it("should join the TilePositions in the direction given", function () {
                const tile1ExpectedToString = "TilePosition: TP1, Contains Tile: [null], Joins: (TP1-A->1-TP2-B)";
                expect(tilePosition1.toString()).to.equal(tile1ExpectedToString);
            });
            it("should not join the TilePositions in the opposite direction", function () {
                const tile2ExpectedToString = "TilePosition: TP2, Contains Tile: [null], Joins: ";
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

    describe("if #isEmpty() is called to test if there is already a Tile at this position", function () {

        const tile1Data: TileData = {
            "tile": "TestTile1",
            "sideA": "0001",
            "sideB": "0010",
            "sideC": "0100"
        };
        const tile1 = new Tile(tile1Data);

        context("and the Position is empty", function () {
            it("should return True", function () {
                const tilePosition = new TilePosition("TP");
                expect(tilePosition.isEmpty()).to.be.true;
            });
        });

        context("and the Position is already occupied by a Tile", function () {
            const tilePosition = new TilePosition("TP");
            assert.isTrue(tilePosition.placeTile(tile1));
            it("should return False", function () {
                expect(tilePosition.isEmpty()).to.be.false;
            });
        });

    });

    describe("if #placeTile() is called to place a Tile (without using matching)", function () {

        const tile1Data: TileData = {
            "tile": "TestTile1",
            "sideA": "0001",
            "sideB": "0010",
            "sideC": "0100"
        };
        const tile1 = new Tile(tile1Data);
        const tile2Data: TileData = {
            "tile": "TestTile2",
            "sideA": "0011",
            "sideB": "0100",
            "sideC": "1001"
        };
        const tile2 = new Tile(tile2Data);

        context("and the Position is empty", function () {
            const tilePosition = new TilePosition("TP");
            const result = tilePosition.placeTile(tile1);
            it("should be placed", function () {
                expect(tilePosition.toString()).to.contain(tile1.toString());
            });
            it("should return True", function () {
                expect(result).to.be.true;
            });
        });

        context("and the Position is already occupied by a Tile", function () {
            const tilePosition = new TilePosition("TP");
            assert.isTrue(tilePosition.placeTile(tile1));
            assert.isTrue(tilePosition.toString().includes(tile1.toString()));
            const result = tilePosition.placeTile(tile2);
            it("should not be placed", function () {
                expect(tilePosition.toString()).to.not.contain(tile2.toString());
            });
            it("should return False", function () {
                expect(result).to.be.false;
            });
        });

    });

});
