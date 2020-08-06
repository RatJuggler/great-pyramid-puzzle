import { buildFace } from "../../../src/js/puzzle-loader";
import { Face } from '../../../src/js/puzzle/face';
import { TilePosition } from "../../../src/js/puzzle/tile-position";
import { assert, expect } from 'chai';
import 'mocha';
// @ts-ignore
import { TILE_1, ONE_TILE_POSITION, ONE_TILE_POSITION_DATA, FOUR_TILE_POSITION_DATA } from "../common-test-data";


describe("Face behavior", function () {

    describe("if a new Face is created", function () {

        context("with a valid Face name and Tile Position details but not joined to any other faces", function () {
            const face = new Face("1", ONE_TILE_POSITION);
            it("should return a correctly initialised instance", function () {
                expect(face).to.be.an.instanceOf(Face);
            });
            it("should return the correct toString result", function () {
                const expectedToString =
                    "Face: 1, Tile Positions: 1, Joins: \n" +
                    "TilePosition: 1, On Face: 1, Contains Tile: [Empty], Joins: \n";
                expect(face.toString()).to.equal(expectedToString);
            });
            it("should fail the integrity check", function () {
                const expectedFailure = [false,
                    "Face joins not complete: Face: 1, Tile Positions: 1, Joins: \n" +
                    "TilePosition: 1, On Face: 1, Contains Tile: [Empty], Joins: \n"];
                expect(face.integrityCheck()).to.eql(expectedFailure)
            });
        });

        context("with an invalid Face name", function () {
            it("should throw an error", function () {
                expect(function () {
                    new Face("Z", ONE_TILE_POSITION);
                }).to.throw(Error, "Face must always be configured with one of the following names [1,2,3,4]!");
            });
        });

        context("with an invalid number of Tiles Positions", function () {
            it("should throw an error", function () {
                expect(function () {
                    buildFace("1", 25, ONE_TILE_POSITION_DATA);
                }).to.throw(Error, "Number of Tile Positions on a Face must be one of 1,4,9!");
            });
        });

        context("where the number of Tile Positions provided does not match the number indicated", function () {
            it("should throw an error", function () {
                expect(function () {
                    buildFace("1", 4, ONE_TILE_POSITION_DATA);
                }).to.throw(Error, "Number of Tile Positions provided (1) does not match number expected (4)!");
            });
        });

        context("and then joined to three other Faces", function () {
            const face1WithOneTilePosition = buildFace("1", 1, ONE_TILE_POSITION_DATA);
            const face2WithOneTilePosition = buildFace("2", 1, ONE_TILE_POSITION_DATA);
            const face3WithOneTilePosition = buildFace("3", 1, ONE_TILE_POSITION_DATA);
            const face4WithOneTilePosition = buildFace("4", 1, ONE_TILE_POSITION_DATA);
            face1WithOneTilePosition.join("A", "B", face2WithOneTilePosition);
            face1WithOneTilePosition.join("B", "C", face3WithOneTilePosition);
            face1WithOneTilePosition.join("C", "A", face4WithOneTilePosition);
            it("should return the correct toString result", function () {
                const expectedToString =
                    "Face: 1, Tile Positions: 1, Joins: (1-A->2-B)(1-B->3-C)(1-C->4-A)\n" +
                    "TilePosition: 1, On Face: 1, Contains Tile: [Empty], Joins: \n";
                expect(face1WithOneTilePosition.toString()).to.equal(expectedToString);
            });
            it("should pass the integrity check", function () {
                expect(face1WithOneTilePosition.integrityCheck()).to.eql([true, "Passed"]);
            });
        });

    });

    describe("if #getTilePosition is called to get the details of a TilePosition", function () {

        const faceWithOneTilePosition = buildFace("1", 1, ONE_TILE_POSITION_DATA);

        context("with the id of an existing TilePosition", function () {
            it("should return the TilePosition", function () {
                expect(faceWithOneTilePosition.getTilePosition("1")).to.be.an.instanceOf(TilePosition);
            });
        });

        context("with the id of a nonexistent TilePosition", function () {
            it("should throw an error", function () {
                expect(function () {
                    faceWithOneTilePosition.getTilePosition("19");
                }).to.throw(Error, "TilePosition (19) not found on Face (1)!");
            });
        });

    });

    describe("if #getTileAtPosition is called to get the Tile at a given Position", function () {

        context("with the id of an existing TilePosition which has a Tile in it", function () {
            const faceWithOneTilePosition = buildFace("1", 1, ONE_TILE_POSITION_DATA);
            assert.isNotNull(faceWithOneTilePosition.emptyTilePositions[0].state.tile = TILE_1);
            it("should return the Tile", function () {
                expect(faceWithOneTilePosition.getTileAtPosition("1")).to.equal(TILE_1);
            });
        });

        context("with the id of an existing TilePosition which doesn't have a Tile in it", function () {
            const faceWithOneTilePosition = buildFace("1", 1, ONE_TILE_POSITION_DATA);
            it("should return throw an error", function () {
                expect(function () {
                    faceWithOneTilePosition.getTileAtPosition("1");
                }).to.throw(Error, "Can't fetch a Tile from a TilePositionState when there isn't one set!");
            });
        });

        context("with the id of a nonexistent TilePosition", function () {
            const faceWithOneTilePosition = buildFace("1", 1, ONE_TILE_POSITION_DATA);
            it("should throw an error", function () {
                expect(function () {
                    faceWithOneTilePosition.getTilePosition("1-1");
                }).to.throw(Error, "TilePosition (1-1) not found on Face (1)!");
            });
        });

    });

    describe("if #join() is called to join one Face to another", function () {

        context("with valid side names and Tile Positions for the two different Faces to be joined", function () {
            const face1WithOneTilePosition = buildFace("1", 1, ONE_TILE_POSITION_DATA);
            const face2WithOneTilePosition = buildFace("2", 1, ONE_TILE_POSITION_DATA);
            face1WithOneTilePosition.join("A", "B", face2WithOneTilePosition);
            it("should join the Faces in the direction given", function () {
                const face1ExpectedToString =
                    "Face: 1, Tile Positions: 1, Joins: (1-A->2-B)\n" +
                    "TilePosition: 1, On Face: 1, Contains Tile: [Empty], Joins: \n";
                expect(face1WithOneTilePosition.toString()).to.equal(face1ExpectedToString);
            });
            it("should not join the Faces in the opposite direction", function () {
                const face2ExpectedToString =
                    "Face: 2, Tile Positions: 1, Joins: \n" +
                    "TilePosition: 1, On Face: 2, Contains Tile: [Empty], Joins: \n";
                expect(face2WithOneTilePosition.toString()).to.equal(face2ExpectedToString);
            });
        });

        context("where the Face to join to is the same as the Face you are joining from", function () {
            const face1WithOneTilePosition = buildFace("1", 1, ONE_TILE_POSITION_DATA);
            it("should throw an error", function () {
                expect(function () {
                    face1WithOneTilePosition.join("A", "B", face1WithOneTilePosition);
                }).to.throw(Error, "Cannot join a Face to itself!");
            });
        });

        context("where the two Faces to be joined have differing numbers of Tile Positions", function () {
            const face1WithOneTilePosition = buildFace("1", 1, ONE_TILE_POSITION_DATA);
            const face2WithFourTilePositions = buildFace("2", 4, FOUR_TILE_POSITION_DATA);
            it("should throw an error", function () {
                expect(function () {
                    face1WithOneTilePosition.join("A", "B", face2WithFourTilePositions);
                }).to.throw(Error, "Cannot join Faces which have differing numbers of Tile Positions!");
            });
        });

        context("where the side name to join from is invalid", function () {
            const face1WithOneTilePosition = buildFace("1", 1, ONE_TILE_POSITION_DATA);
            const face2WithOneTilePosition = buildFace("2", 1, ONE_TILE_POSITION_DATA);
            it("should throw an error", function () {
                expect(function () {
                    face1WithOneTilePosition.join("7", "A", face2WithOneTilePosition);
                }).to.throw(Error, "Side to join from must be one of A,B,C!");
            });
        });

        context("where the side name to join to is invalid", function () {
            const face1WithOneTilePosition = buildFace("1", 1, ONE_TILE_POSITION_DATA);
            const face2WithOneTilePosition = buildFace("2", 1, ONE_TILE_POSITION_DATA);
            it("should throw an error", function () {
                expect(function () {
                    face1WithOneTilePosition.join("A", "Z", face2WithOneTilePosition);
                }).to.throw(Error, "Side to join to must be one of A,B,C!");
            });
        });

        context("where there is already a join for the side given", function () {
            const face1WithOneTilePosition = buildFace("1", 1, ONE_TILE_POSITION_DATA);
            const face2WithOneTilePosition = buildFace("2", 1, ONE_TILE_POSITION_DATA);
            const face3WithOneTilePosition = buildFace("3", 1, ONE_TILE_POSITION_DATA);
            face1WithOneTilePosition.join("A", "B", face2WithOneTilePosition);
            it("should throw an error", function () {
                expect(function () {
                    face1WithOneTilePosition.join("A", "B", face3WithOneTilePosition);
                }).to.throw(Error, "Existing join already present for side A!");
            });
        });

        context("where the Face is already joined to three others", function () {
            const face1WithOneTilePosition = buildFace("1", 1, ONE_TILE_POSITION_DATA);
            const face2WithOneTilePosition = buildFace("2", 1, ONE_TILE_POSITION_DATA);
            const face3WithOneTilePosition = buildFace("3", 1, ONE_TILE_POSITION_DATA);
            const face4WithOneTilePosition = buildFace("4", 1, ONE_TILE_POSITION_DATA);
            const face5WithOneTilePosition = buildFace("1", 1, ONE_TILE_POSITION_DATA);
            face1WithOneTilePosition.join("A", "B", face2WithOneTilePosition);
            face1WithOneTilePosition.join("B", "C", face3WithOneTilePosition);
            face1WithOneTilePosition.join("C", "A", face4WithOneTilePosition);
            assert(face1WithOneTilePosition.integrityCheck());
            it("should throw an error", function () {
                expect(function () {
                    face1WithOneTilePosition.join("A", "A", face5WithOneTilePosition);
                }).to.throw(Error, "Faces can only join to three other faces!");
            });
        });

    });

    describe("if #hasEmptyTilePositions() is called to test if there are any empty Tile Positions on this Face", function () {

        context("and there are empty Tile Positions", function () {
            const faceWithOneTilePosition = buildFace("1", 1, ONE_TILE_POSITION_DATA);
            it("should return True", function () {
                expect(faceWithOneTilePosition.hasEmptyTilePositions()).to.be.true;
            });
        });

        context("and there aren't any empty Tile Positions", function () {
            const faceWithOneTilePosition = buildFace("1", 1, ONE_TILE_POSITION_DATA);
            assert.isNotNull(faceWithOneTilePosition.emptyTilePositions[0].state.tile = TILE_1);
            it("should return False", function () {
                expect(faceWithOneTilePosition.hasEmptyTilePositions()).to.be.false;
            });
        });

    });

});
