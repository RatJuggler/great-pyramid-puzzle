import { Face } from '../../src/js/face';
import { TilePositionData } from "../../src/js/puzzle-data-schema";
import { expect } from 'chai';
import 'mocha';


describe("Face behavior", function () {

    let oneTilePositions: TilePositionData[] = [
        {"position": "1", "joins": []}
    ];
    let faceWithOneTilePosition = new Face("1", 1, oneTilePositions);

    describe("if a new Face is created", function () {

        context("with a valid name and number of tiles", function () {
            it("should return a correctly initialised instance", function () {
                const name = "1";
                const face = new Face(name, 1, oneTilePositions);
                expect(face).to.be.an.instanceOf(Face);
                expect(face.name).to.equal(name);
            });
        });

        context("with an invalid name", function () {
            it("should throw an error", function () {
                expect(function () {
                    new Face("Z", 4, oneTilePositions);
                }).to.throw(Error, "Face name must be one of 1,2,3,4!");
            });
        });

        context("with an invalid number of tiles", function () {
            it("should throw an error", function () {
                expect(function () {
                    new Face("1", 25, oneTilePositions);
                }).to.throw(Error, "Number of tiles on a Face must be one of 1,4,9!");
            });
        });

    });

    describe("if a Face is joined to another Face", function () {

        context("with valid side names for both Faces", function () {
            it("should be accepted", function () {
                faceWithOneTilePosition.join("A", "B", faceWithOneTilePosition);
            });
        });

        context("where the Faces have differing numbers of tiles", function () {
            it("should throw an error", function () {
                const fourTilePositions = [
                    {"position": "1", "joins": []},
                    {"position": "2", "joins": []},
                    {"position": "3", "joins": []},
                    {"position": "4", "joins": []}
                ];
                const faceWithFourTilePositions = new Face("2", 4, fourTilePositions);
                expect(function () {
                    faceWithOneTilePosition.join("A", "B", faceWithFourTilePositions);
                }).to.throw(Error, "Cannot join Faces which have differing numbers of tile positions!");
            });
        });

        context("where the side to join from is invalid", function () {
            it("should throw an error", function () {
                expect(function () {
                    faceWithOneTilePosition.join("7", "A", faceWithOneTilePosition);
                }).to.throw(Error, "Side to join from must be one of A,B,C!");
            });
        });

        context("where the side name to join to is invalid", function () {
            it("should throw an error", function () {
                expect(function () {
                    faceWithOneTilePosition.join("A", "Z", faceWithOneTilePosition);
                }).to.throw(Error, "Side to join to must be one of A,B,C!");
            });
        });

    });

    describe("if a Tile is placed on a Face (without using matching)", function () {

        context("and the Face has no Tiles on it", function () {
            it("should be placed in a random position", function () {

            });
        });

        context("and the Face already has Tiles on it", function () {
            it("should be placed in a random empty position", function () {

            });
        });

        context("and the Face has no remaining empty positions", function () {
            it("should return undefined", function () {

            });
        });

    });

});
