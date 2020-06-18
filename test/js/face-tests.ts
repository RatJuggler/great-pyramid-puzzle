import { Face } from '../../src/js/face';
import { Tile } from "../../src/js/tile";
import { assert, expect } from 'chai';
import 'mocha';

describe("Face behavior", () => {

    describe("if a new Face", () => {

        context("is created with valid parameters", () => {
            it("should return a correctly initialised instance", () => {
                const name = "ValidFace";
                const numberOfTiles = 4;
                const face = new Face(name, numberOfTiles);
                expect(face.name).to.equal(name);
            });
        });

        context("is created with invalid parameters", () => {
            it("should throw an error", () => {
                expect(() => {
                    new Face("InvalidFace", 25);
                }).to.throw(Error, "Number of tiles on a Face must be one of 1,4,9!");
            });
        });

    });

    describe("if a Face side is joined to another Face side", () => {

        context("with valid parameters", () => {
            it("should be accepted", () => {
                const face1 = new Face("Test1", 1);
                const face2 = new Face("Test2", 1);
                face1.joinSideWith("1", face2, "1");
            });
        });

        context("with invalid parameters", () => {
            it("should throw an error", () => {
                const face1 = new Face("Test1", 1);
                const face2 = new Face("Test2", 1);
                expect(() => {
                    face1.joinSideWith("7", face2, "Z");
                }).to.throw(Error, "Join side must be one of 1,2,3!");
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
