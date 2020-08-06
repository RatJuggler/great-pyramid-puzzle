import { Face } from '../../../src/js/puzzle/face';
import { TilePosition } from "../../../src/js/puzzle/tile-position";
import { assert, expect } from 'chai';
import 'mocha';
// @ts-ignore
import { TILE_1 } from "../common-test-data";


describe("Face behavior", function () {

    let face1WithOneTilePosition: Face;
    let face2WithOneTilePosition: Face;
    let face3WithOneTilePosition: Face;
    let face4WithOneTilePosition: Face;
    let tilePositions1: Map<string, TilePosition>;
    let tilePositions2: Map<string, TilePosition>;
    let tilePositions3: Map<string, TilePosition>;
    let tilePositions4: Map<string, TilePosition>;

    beforeEach(function () {
        const tilePosition1_1 = new TilePosition("1", "1");
        tilePositions1 = new Map<string, TilePosition>();
        tilePositions1.set(tilePosition1_1.name, tilePosition1_1);
        face1WithOneTilePosition = new Face("1", tilePositions1);
        const tilePosition2_1 = new TilePosition("1", "2");
        tilePositions2 = new Map<string, TilePosition>();
        tilePositions2.set(tilePosition2_1.name, tilePosition2_1);
        face2WithOneTilePosition = new Face("2", tilePositions2);
        const tilePosition3_1 = new TilePosition("1", "3");
        tilePositions3 = new Map<string, TilePosition>();
        tilePositions3.set(tilePosition3_1.name, tilePosition3_1);
        face3WithOneTilePosition = new Face("3", tilePositions3);
        const tilePosition4_1 = new TilePosition("1", "4");
        tilePositions4 = new Map<string, TilePosition>();
        tilePositions4.set(tilePosition2_1.name, tilePosition4_1);
        face4WithOneTilePosition = new Face("4", tilePositions4);
    });

    describe("if a new Face is created", function () {

        context("with a valid Face name and Tile Position details but not joined to any other faces", function () {
            it("should return a correctly initialised instance", function () {
                expect(face1WithOneTilePosition).to.be.an.instanceOf(Face);
            });
            it("should return the correct toString result", function () {
                const expectedToString =
                    "Face: 1, Tile Positions: 1, Joins: \n" +
                    "TilePosition: 1, On Face: 1, Contains Tile: [Empty], Joins: \n";
                expect(face1WithOneTilePosition.toString()).to.equal(expectedToString);
            });
            it("should fail the integrity check", function () {
                const expectedFailure = [false,
                    "Face joins not complete: Face: 1, Tile Positions: 1, Joins: \n" +
                    "TilePosition: 1, On Face: 1, Contains Tile: [Empty], Joins: \n"];
                expect(face1WithOneTilePosition.integrityCheck()).to.eql(expectedFailure)
            });
        });

        context("with an invalid Face name", function () {
            it("should throw an error", function () {
                expect(function () {
                    new Face("Z", tilePositions1);
                }).to.throw(Error, "Face must always be configured with one of the following names [1,2,3,4]!");
            });
        });

        context("with an invalid number of Tiles Positions", function () {
            it("should throw an error", function () {
                const tilePosition = new TilePosition("2", "1");
                tilePositions1.set(tilePosition.name, tilePosition);
                expect(function () {
                    new Face("1", tilePositions1);
                }).to.throw(Error, "Face must always be configured with one of 1,4,9 TilePositions!");
            });
        });

        context("and then joined to three other Faces", function () {
            it("should return the correct toString result", function () {
                face1WithOneTilePosition.join("A", "B", face2WithOneTilePosition);
                face1WithOneTilePosition.join("B", "C", face3WithOneTilePosition);
                face1WithOneTilePosition.join("C", "A", face4WithOneTilePosition);
                const expectedToString =
                    "Face: 1, Tile Positions: 1, Joins: (1-A->2-B)(1-B->3-C)(1-C->4-A)\n" +
                    "TilePosition: 1, On Face: 1, Contains Tile: [Empty], Joins: \n";
                expect(face1WithOneTilePosition.toString()).to.equal(expectedToString);
            });
            it("should pass the integrity check", function () {
                face1WithOneTilePosition.join("A", "B", face2WithOneTilePosition);
                face1WithOneTilePosition.join("B", "C", face3WithOneTilePosition);
                face1WithOneTilePosition.join("C", "A", face4WithOneTilePosition);
                expect(face1WithOneTilePosition.integrityCheck()).to.eql([true, "Passed"]);
            });
        });

    });

    describe("if #getTilePosition is called to get the details of a TilePosition", function () {

        context("with the id of an existing TilePosition", function () {
            it("should return the TilePosition", function () {
                expect(face1WithOneTilePosition.getTilePosition("1")).to.be.an.instanceOf(TilePosition);
            });
        });

        context("with the id of a nonexistent TilePosition", function () {
            it("should throw an error", function () {
                expect(function () {
                    face1WithOneTilePosition.getTilePosition("19");
                }).to.throw(Error, "TilePosition (19) not found on Face (1)!");
            });
        });

    });

    describe("if #getTileAtPosition is called to get the Tile at a given Position", function () {

        context("with the id of an existing TilePosition which has a Tile in it", function () {
            it("should return the Tile", function () {
                face1WithOneTilePosition.emptyTilePositions[0].state.tile = TILE_1;
                expect(face1WithOneTilePosition.getTileAtPosition("1")).to.equal(TILE_1);
            });
        });

        context("with the id of an existing TilePosition which doesn't have a Tile in it", function () {
            it("should return throw an error", function () {
                expect(function () {
                    face1WithOneTilePosition.getTileAtPosition("1");
                }).to.throw(Error, "Can't fetch a Tile from a TilePositionState when there isn't one set!");
            });
        });

        context("with the id of a nonexistent TilePosition", function () {
            it("should throw an error", function () {
                expect(function () {
                    face1WithOneTilePosition.getTilePosition("1-1");
                }).to.throw(Error, "TilePosition (1-1) not found on Face (1)!");
            });
        });

    });

    describe("if #join() is called to join one Face to another", function () {

        context("with valid side names and Tile Positions for the two different Faces to be joined", function () {
            it("should join the Faces in the direction given", function () {
                face1WithOneTilePosition.join("A", "B", face2WithOneTilePosition);
                const face1ExpectedToString =
                    "Face: 1, Tile Positions: 1, Joins: (1-A->2-B)\n" +
                    "TilePosition: 1, On Face: 1, Contains Tile: [Empty], Joins: \n";
                expect(face1WithOneTilePosition.toString()).to.equal(face1ExpectedToString);
            });
            it("should not join the Faces in the opposite direction", function () {
                face1WithOneTilePosition.join("A", "B", face2WithOneTilePosition);
                const face2ExpectedToString =
                    "Face: 2, Tile Positions: 1, Joins: \n" +
                    "TilePosition: 1, On Face: 2, Contains Tile: [Empty], Joins: \n";
                expect(face2WithOneTilePosition.toString()).to.equal(face2ExpectedToString);
            });
        });

        context("where the Face to join to is the same as the Face you are joining from", function () {
            it("should throw an error", function () {
                expect(function () {
                    face1WithOneTilePosition.join("A", "B", face1WithOneTilePosition);
                }).to.throw(Error, "Cannot join a Face to itself!");
            });
        });

        context("where the two Faces to be joined have differing numbers of Tile Positions", function () {
            it("should throw an error", function () {
                const tilePosition2_2 = new TilePosition("2", "2");
                const tilePosition2_3 = new TilePosition("3", "2");
                const tilePosition2_4 = new TilePosition("4", "2");
                tilePositions2.set(tilePosition2_2.name, tilePosition2_2);
                tilePositions2.set(tilePosition2_3.name, tilePosition2_3);
                tilePositions2.set(tilePosition2_4.name, tilePosition2_4);
                const face2WithFourTilePositions = new Face("2", tilePositions2);
                expect(function () {
                    face1WithOneTilePosition.join("A", "B", face2WithFourTilePositions);
                }).to.throw(Error, "Cannot join Faces which have differing numbers of Tile Positions!");
            });
        });

        context("where the side name to join from is invalid", function () {
            it("should throw an error", function () {
                expect(function () {
                    face1WithOneTilePosition.join("7", "A", face2WithOneTilePosition);
                }).to.throw(Error, "Side to join from must be one of A,B,C!");
            });
        });

        context("where the side name to join to is invalid", function () {
            it("should throw an error", function () {
                expect(function () {
                    face1WithOneTilePosition.join("A", "Z", face2WithOneTilePosition);
                }).to.throw(Error, "Side to join to must be one of A,B,C!");
            });
        });

        context("where there is already a join for the side given", function () {
            it("should throw an error", function () {
                face1WithOneTilePosition.join("A", "B", face2WithOneTilePosition);
                expect(function () {
                    face1WithOneTilePosition.join("A", "B", face3WithOneTilePosition);
                }).to.throw(Error, "Existing join already present for side A!");
            });
        });

        context("where the Face is already joined to three others", function () {
            it("should throw an error", function () {
                const tilePosition5_1 = new TilePosition("1", "5");
                const tilePositions5 = new Map<string, TilePosition>();
                tilePositions5.set(tilePosition5_1.name, tilePosition5_1);
                const face5WithOneTilePosition = new Face("4", tilePositions4);
                face1WithOneTilePosition.join("A", "B", face2WithOneTilePosition);
                face1WithOneTilePosition.join("B", "C", face3WithOneTilePosition);
                face1WithOneTilePosition.join("C", "A", face4WithOneTilePosition);
                assert(face1WithOneTilePosition.integrityCheck());
                expect(function () {
                    face1WithOneTilePosition.join("A", "A", face5WithOneTilePosition);
                }).to.throw(Error, "Faces can only join to three other faces!");
            });
        });

    });

    describe("if #hasEmptyTilePositions() is called to test if there are any empty Tile Positions on this Face", function () {

        context("and there are empty Tile Positions", function () {
            it("should return True", function () {
                expect(face1WithOneTilePosition.hasEmptyTilePositions()).to.be.true;
            });
        });

        context("and there aren't any empty Tile Positions", function () {
            it("should return False", function () {
                face1WithOneTilePosition.emptyTilePositions[0].state.tile = TILE_1;
                expect(face1WithOneTilePosition.hasEmptyTilePositions()).to.be.false;
            });
        });

    });

});
