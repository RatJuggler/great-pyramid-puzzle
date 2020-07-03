import { Face } from '../../src/js/face';
import { TilePosition } from "../../src/js/tile-position";
import { assert, expect } from 'chai';
import 'mocha';
// @ts-ignore
import { TILE_1, TILE_2, ONE_TILE_POSITION_DATA, FOUR_TILE_POSITION_DATA } from "./common-test-data";


describe("Face behavior", function () {

    describe("if a new Face is created", function () {

        context("with a valid Face name and Tile Position details", function () {
            const face = new Face("1", 1, ONE_TILE_POSITION_DATA);
            it("should return a correctly initialised instance", function () {
                expect(face).to.be.an.instanceOf(Face);
            });
            it("should return the correct toString result", function () {
                const expectedToString =
                    "Face: 1, Tile Positions: 1, Joins: \nTilePosition: 1, On Face: 1, Contains Tile: [null], Joins: \n";
                expect(face.toString()).to.equal(expectedToString);
            });
        });

        context("with an invalid Face name", function () {
            it("should throw an error", function () {
                expect(function () {
                    new Face("Z", 1, ONE_TILE_POSITION_DATA);
                }).to.throw(Error, "Face name must be one of 1,2,3,4!");
            });
        });

        context("with an invalid number of Tiles Positions", function () {
            it("should throw an error", function () {
                expect(function () {
                    new Face("1", 25, ONE_TILE_POSITION_DATA);
                }).to.throw(Error, "Number of Tile Positions on a Face must be one of 1,4,9!");
            });
        });

        context("where the number of Tile Positions provided does not match the number indicated", function () {
            it("should throw an error", function () {
                expect(function () {
                    new Face("1", 4, ONE_TILE_POSITION_DATA);
                }).to.throw(Error, "Number of Tile Positions provided (1) does not match number expected (4)!");
            });
        });

    });

    describe("if #getTilePosition is called to get the details of a TilePosition", function () {

        const faceWithOneTilePosition = new Face("1", 1, ONE_TILE_POSITION_DATA);

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
            const faceWithOneTilePosition = new Face("1", 1, ONE_TILE_POSITION_DATA);
            assert.isTrue(faceWithOneTilePosition.placeTileRandomly(TILE_1));
            it("should return the Tile", function () {
                expect(faceWithOneTilePosition.getTileAtPosition("1")).to.equal(TILE_1);
            });
        });

        context("with the id of an existing TilePosition which doesn't have a Tile in it", function () {
            const faceWithOneTilePosition = new Face("1", 1, ONE_TILE_POSITION_DATA);
            it("should return throw an error", function () {
                expect(function () {
                    faceWithOneTilePosition.getTileAtPosition("1");
                }).to.throw(Error, "Can't fetch a Tile when there isn't one!");
            });
        });

        context("with the id of a nonexistent TilePosition", function () {
            const faceWithOneTilePosition = new Face("1", 1, ONE_TILE_POSITION_DATA);
            it("should throw an error", function () {
                expect(function () {
                    faceWithOneTilePosition.getTilePosition("1-1");
                }).to.throw(Error, "TilePosition (1-1) not found on Face (1)!");
            });
        });

    });

    describe("if #join() is called to join one Face to another", function () {

        const face1WithOneTilePosition = new Face("1", 1, ONE_TILE_POSITION_DATA);
        const face2WithOneTilePosition = new Face("1", 1, ONE_TILE_POSITION_DATA);

        context("with valid side names for the two different Faces to be joined", function () {
            face1WithOneTilePosition.join("A", "B", face2WithOneTilePosition);
            it("should join the Faces in the direction given", function () {
                const face1ExpectedToString =
                    "Face: 1, Tile Positions: 1, Joins: (1-A->1-B)\nTilePosition: 1, On Face: 1, Contains Tile: [null], Joins: \n";
                expect(face1WithOneTilePosition.toString()).to.equal(face1ExpectedToString);
            });
            it("should not join the Faces in the opposite direction", function () {
                const face2ExpectedToString =
                    "Face: 1, Tile Positions: 1, Joins: \nTilePosition: 1, On Face: 1, Contains Tile: [null], Joins: \n";
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
            const faceWithFourTilePositions = new Face("2", 4, FOUR_TILE_POSITION_DATA);
            it("should throw an error", function () {
                expect(function () {
                    face1WithOneTilePosition.join("A", "B", faceWithFourTilePositions);
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

    });

    describe("if #hasEmptyTilePositions() is called to test if there are any empty Tile Positions on this Face", function () {

        context("and there are empty Tile Positions", function () {
            const faceWithOneTilePosition = new Face("1", 1, ONE_TILE_POSITION_DATA);
            it("should return True", function () {
                expect(faceWithOneTilePosition.hasEmptyTilePositions()).to.be.true;
            });
        });

        context("and there aren't any empty Tile Positions", function () {
            const faceWithOneTilePosition = new Face("1", 1, ONE_TILE_POSITION_DATA);
            assert.isTrue(faceWithOneTilePosition.placeTileSequentially(TILE_1));
            it("should return False", function () {
                expect(faceWithOneTilePosition.hasEmptyTilePositions()).to.be.false;
            });
        });

    });

    describe("if #placeTileRandomly() is called to place a Tile (without using matching)", function () {

        context("and all the Tile Positions on the Face are empty", function () {
            const faceWithOneTilePosition = new Face("1", 1, ONE_TILE_POSITION_DATA);
            const result = faceWithOneTilePosition.placeTileRandomly(TILE_1);
            it("should place the Tile in a random Position", function () {
                expect(faceWithOneTilePosition.toString()).to.contain(TILE_1.toString());
            });
            it("should return True", function () {
                expect(result).to.be.true;
            });
        });

        context("and the Face already has some filled Tile Positions on it", function () {
            const faceWithFourTilePositions = new Face("2", 4, FOUR_TILE_POSITION_DATA);
            assert.isTrue(faceWithFourTilePositions.placeTileRandomly(TILE_1));
            const result = faceWithFourTilePositions.placeTileRandomly(TILE_2);
            it("should place the Tile in a random empty Position", function () {
                expect(faceWithFourTilePositions.toString()).to.contain(TILE_2.toString());
            });
            it("should return True", function () {
                expect(result).to.be.true;
            });
        });

        context("and the Face has no remaining empty Tile Positions", function () {
            const faceWithOneTilePosition = new Face("1", 1, ONE_TILE_POSITION_DATA);
            assert.isTrue(faceWithOneTilePosition.placeTileRandomly(TILE_1));
            const result = faceWithOneTilePosition.placeTileRandomly(TILE_2);
            it("should not be placed", function () {
                expect(faceWithOneTilePosition.toString()).to.not.contain(TILE_2.toString());
            });
            it("should return False", function () {
                expect(result).to.be.false;
            });
        });

    });

    describe("if #placeTileSequantially() is called to place a Tile (without using matching)", function () {

        context("and all the Tile Positions on the Face are empty", function () {
            const faceWithOneTilePosition = new Face("1", 1, ONE_TILE_POSITION_DATA);
            const result = faceWithOneTilePosition.placeTileSequentially(TILE_1);
            it("should place the Tile at Position 1", function () {
                expect(faceWithOneTilePosition.getTileAtPosition("1")).to.equal(TILE_1);
            });
            it("should return True", function () {
                expect(result).to.be.true;
            });
        });

        context("and the Face already has some filled Tile Positions on it", function () {
            const faceWithFourTilePositions = new Face("2", 4, FOUR_TILE_POSITION_DATA);
            assert.isTrue(faceWithFourTilePositions.placeTileSequentially(TILE_1));
            const result = faceWithFourTilePositions.placeTileSequentially(TILE_2);
            it("should place the Tile at the next sequentially free Position", function () {
                expect(faceWithFourTilePositions.getTileAtPosition("2")).to.equal(TILE_2);
            });
            it("should return True", function () {
                expect(result).to.be.true;
            });
        });

        context("and the Face has no remaining empty Tile Positions", function () {
            const faceWithOneTilePosition = new Face("1", 1, ONE_TILE_POSITION_DATA);
            assert.isTrue(faceWithOneTilePosition.placeTileSequentially(TILE_1));
            const result = faceWithOneTilePosition.placeTileSequentially(TILE_2);
            it("should not be placed", function () {
                expect(faceWithOneTilePosition.getTileAtPosition("1")).to.equal(TILE_1);
            });
            it("should return False", function () {
                expect(result).to.be.false;
            });
        });

    });

});
