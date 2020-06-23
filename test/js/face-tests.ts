import { Face } from '../../src/js/face';
import { TilePositionData } from "../../src/js/puzzle-data-schema";
import { expect } from 'chai';
import 'mocha';


describe("Face behavior", () => {

    let oneTilePositions: TilePositionData[] = [
        {"position": "1", "joins": []}
    ];
    let faceWithOneTilePosition = new Face("1", 1, oneTilePositions);

    describe("if a new Face is created", () => {

        context("with a valid name and number of tiles", () => {
            it("should return a correctly initialised instance", () => {
                const name = "1";
                const face = new Face(name, 1, oneTilePositions);
                expect(face).to.be.an.instanceOf(Face);
                expect(face.name).to.equal(name);
            });
        });

        context("with an invalid name", () => {
            it("should throw an error", () => {
                expect(() => {
                    new Face("Z", 4, oneTilePositions);
                }).to.throw(Error, "Face name must be one of 1,2,3,4!");
            });
        });

        context("with an invalid number of tiles", () => {
            it("should throw an error", () => {
                expect(() => {
                    new Face("1", 25, oneTilePositions);
                }).to.throw(Error, "Number of tiles on a Face must be one of 1,4,9!");
            });
        });

    });

    describe("if a Face is joined to another Face", () => {

        context("with valid side names for both Faces", () => {
            it("should be accepted", () => {
                faceWithOneTilePosition.join("A", "B", faceWithOneTilePosition);
            });
        });

        context("where the Faces have differing numbers of tiles", () => {
            it("should throw an error", () => {
                const fourTilePositions = [
                    {"position": "1", "joins": []},
                    {"position": "2", "joins": []},
                    {"position": "3", "joins": []},
                    {"position": "4", "joins": []}
                ];
                const faceWithFourTilePositions = new Face("2", 4, fourTilePositions);
                expect(() => {
                    faceWithOneTilePosition.join("A", "B", faceWithFourTilePositions);
                }).to.throw(Error, "Cannot join Faces which have differing numbers of tile positions!");
            });
        });

        context("where the side to join from is invalid", () => {
            it("should throw an error", () => {
                expect(() => {
                    faceWithOneTilePosition.join("7", "A", faceWithOneTilePosition);
                }).to.throw(Error, "Side to join from must be one of A,B,C!");
            });
        });

        context("where the side name to join to is invalid", () => {
            it("should throw an error", () => {
                expect(() => {
                    faceWithOneTilePosition.join("A", "Z", faceWithOneTilePosition);
                }).to.throw(Error, "Side to join to must be one of A,B,C!");
            });
        });

    });

});
