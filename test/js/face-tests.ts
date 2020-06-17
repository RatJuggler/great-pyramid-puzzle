import { Face } from '../../src/js/face';
import { Tile } from "../../src/js/tile";
import { assert, expect } from 'chai';
import 'mocha';

describe("Face behavior", () => {

    describe("a new Face", () => {

        context("with valid parameters", () => {
            it("should return a correctly initialised instance", () => {
                const id = "Face1";
                const numberOfTiles = 4;
                const face = new Face(id, numberOfTiles);
                expect(face.id).to.equal(id);
                expect(face.numberOfTiles).to.equal(numberOfTiles);
            });
        });

        context("with invalid parameters", () => {
            it("should throw an error", () => {
                expect(() => {
                    new Face("Face2", 13);
                }).to.throw(Error, "Number of tiles on a Face must be one of 1,4,9!");
            });
        });

    });

    describe("adding a Tile", () => {

        context("to an empty Face", () => {
            it("it should always be added", () => {
                const face = new Face("Face3", 1);
                const tile = new Tile("XYZ");
                face.addTile(tile);
                expect(face.tiles.includes(tile)).to.be.true;
            })
        });

        context("to a full Face", () => {
            it("it should always be rejected", () => {
                assert.fail("Behavior not implemented...");
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
