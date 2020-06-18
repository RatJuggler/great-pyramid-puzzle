import { Face } from '../../src/js/face';
import { Tile } from "../../src/js/tile";
import { assert, expect } from 'chai';
import 'mocha';

describe("Face behavior", () => {

    describe("if a new Face", () => {

        context("is created with a valid number of tiles", () => {
            it("should return a correctly initialised instance", () => {
                const name = "ValidFace";
                const numberOfTiles = 4;
                const face = new Face(name, numberOfTiles);
                expect(face).to.be.an.instanceOf(Face);
                expect(face.name).to.equal(name);
            });
        });

        context("is created with invalid number of tiles", () => {
            it("should throw an error", () => {
                expect(() => {
                    new Face("InvalidFace", 25);
                }).to.throw(Error, "Number of tiles on a Face must be one of 1,4,9!");
            });
        });

    });

    describe("if a Face is joined to another Face", () => {

        context("with valid side names for both", () => {
            it("should be accepted", () => {
                const face1 = new Face("Face1", 1);
                const face2 = new Face("Face2", 1);
                face1.join("1", face2, "1");
            });
        });

        context("where the Faces have differing numbers of tiles", () => {
            it("should throw an error", () => {
                const face1 = new Face("Face1", 1);
                const face2 = new Face("Face2", 4);
                expect(() => {
                    face1.join("1", face2, "1");
                }).to.throw(Error, "Cannot join Faces with different numbers of tiles!");
            });
        });

        context("with an invalid side name to join from", () => {
            it("should throw an error", () => {
                const face1 = new Face("Face1", 1);
                const face2 = new Face("Face2", 1);
                expect(() => {
                    face1.join("7", face2, "1");
                }).to.throw(Error, "Side to join from must be one of 1,2,3!");
            });
        });

        context("with an invalid side name to join to", () => {
            it("should throw an error", () => {
                const face1 = new Face("Face1", 1);
                const face2 = new Face("Face2", 1);
                expect(() => {
                    face1.join("1", face2, "Z");
                }).to.throw(Error, "Side to join to must be one of 1,2,3!");
            });
        });

    });

    describe("adding a Tile", () => {

        context("to an empty Face", () => {
            it("it should always be added", () => {
                const face = new Face("EmptyFace", 1);
                const tile = new Tile("XYZ");
                face.addTile(tile);
                expect(face.tiles.includes(tile)).to.be.true;
            })
        });

        context("to a full Face", () => {
            it("it should always be rejected", () => {
                const face = new Face("FullFace", 1);
                const tile = new Tile("PQR");
                face.addTile(tile);
                const anotherTile = new Tile("IJK");
                face.addTile(anotherTile);
                expect(face.tiles.includes(anotherTile)).to.be.false;
            });
        });

        context("to a Face with existing Tiles which match", () => {
            it("should be added", () => {
                assert.fail("Behavior not implemented...");
            });
        });

        context("to a Face with existing Tiles which don't match", () => {
            it("should be rejected", () => {
                assert.fail("Behavior not implemented...");
            });
        });

    });

});
