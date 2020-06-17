import { Face } from '../../src/js/face';
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
                const id = "Face2";
                const numberOfTiles = 13;
                expect(() => {
                    new Face(id, numberOfTiles);
                }).to.throw(Error, "Number of tiles on a Face must be one of 1,4,9!");
            });
        });

    });

    describe("adding a Tile", () => {

        context("to an empty Face", () => {
            it("it should always be added", () => {
                assert.fail("Behavior not implemented...");
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
