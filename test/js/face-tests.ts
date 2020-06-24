import { Face } from '../../src/js/face';
import { Tile } from "../../src/js/tile";
import { TileData, TilePositionData } from "../../src/js/puzzle-data-schema";
import { assert, expect} from 'chai';
import 'mocha';


describe("Face behavior", function () {

    const oneTilePositions: TilePositionData[] = [
        {"position": "1", "joins": []}
    ];

    describe("if a new Face is created", function () {

        context("with a valid Face name and Tile Position details", function () {
            const face = new Face("1", 1, oneTilePositions);
            it("should return a correctly initialised instance", function () {
                expect(face).to.be.an.instanceOf(Face);
            });
            it("should return the correct toString result", function () {
                const expectedToString =
                    "Face: 1, Tile Positions: 1, Joins: \nTilePosition: 1, Contains Tile: [null], Joins: \n";
                expect(face.toString()).to.equal(expectedToString);
            });
        });

        context("with an invalid Face name", function () {
            it("should throw an error", function () {
                expect(function () {
                    new Face("Z", 1, oneTilePositions);
                }).to.throw(Error, "Face name must be one of 1,2,3,4!");
            });
        });

        context("with an invalid number of Tiles Positions", function () {
            it("should throw an error", function () {
                expect(function () {
                    new Face("1", 25, oneTilePositions);
                }).to.throw(Error, "Number of Tile Positions on a Face must be one of 1,4,9!");
            });
        });

        context("where the number of Tile Positions provided does not match the number indicated", function () {
            it("should throw an error", function () {
                expect(function () {
                    new Face("1", 4, oneTilePositions);
                }).to.throw(Error, "Number of Tile Positions provided (1) does not match number expected (4)!");
            });
        });

    });

    describe("if #join() is called to join one Face to another", function () {

        const face1WithOneTilePosition = new Face("1", 1, oneTilePositions);
        const face2WithOneTilePosition = new Face("1", 1, oneTilePositions);

        context("with valid side names for the two different Faces to be joined", function () {
            face1WithOneTilePosition.join("A", "B", face2WithOneTilePosition);
            it("should join the Faces in the direction given", function () {
                const face1ExpectedToString =
                    "Face: 1, Tile Positions: 1, Joins: (1-A->1-B)\nTilePosition: 1, Contains Tile: [null], Joins: \n";
                expect(face1WithOneTilePosition.toString()).to.equal(face1ExpectedToString);
            });
            it("should not join the Faces in the opposite direction", function () {
                const face2ExpectedToString =
                    "Face: 1, Tile Positions: 1, Joins: \nTilePosition: 1, Contains Tile: [null], Joins: \n";
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
                const fourTilePositions = [
                    {"position": "1", "joins": []},
                    {"position": "2", "joins": []},
                    {"position": "3", "joins": []},
                    {"position": "4", "joins": []}
                ];
                const faceWithFourTilePositions = new Face("2", 4, fourTilePositions);
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

    describe("if #placeTileWithoutMatching() is called to place a Tile (without using matching)", function () {

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

        context("and all the Tile Positions on the Face are empty", function () {
            const faceWithOneTilePosition = new Face("1", 1, oneTilePositions);
            const result = faceWithOneTilePosition.placeTileWithoutMatching(tile1);
            it("should place the Tile in a random Position", function () {
                expect(faceWithOneTilePosition.toString()).to.contain(tile1.toString());
            });
            it("should return True", function () {
                expect(result).to.be.true;
            });
        });

        context("and the Face already has filled Tile Positions on it", function () {
            const fourTilePositions = [
                {"position": "1", "joins": []},
                {"position": "2", "joins": []},
                {"position": "3", "joins": []},
                {"position": "4", "joins": []}
            ];
            const faceWithFourTilePositions = new Face("2", 4, fourTilePositions);
            assert.isTrue(faceWithFourTilePositions.placeTileWithoutMatching(tile1));
            assert.isTrue(faceWithFourTilePositions.toString().includes(tile1.toString()));
            const result = faceWithFourTilePositions.placeTileWithoutMatching(tile2);
            it("should place the Tile in a random empty Position", function () {
                expect(faceWithFourTilePositions.toString()).to.contain(tile2.toString());
            });
            it("should return True", function () {
                expect(result).to.be.true;
            });
        });

        context("and the Face has no remaining empty Tile Positions", function () {
            const faceWithOneTilePosition = new Face("1", 1, oneTilePositions);
            assert.isTrue(faceWithOneTilePosition.placeTileWithoutMatching(tile1));
            assert.isTrue(faceWithOneTilePosition.toString().includes(tile1.toString()));
            const result = faceWithOneTilePosition.placeTileWithoutMatching(tile2);
            it("should not be placed", function () {
                expect(faceWithOneTilePosition.toString()).to.not.contain(tile2.toString());
            });
            it("should return False", function () {
                expect(result).to.be.false;
            });
        });

    });

});
