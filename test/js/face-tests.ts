import { Face } from '../../src/js/face';
import { expect } from 'chai';
import 'mocha';

describe("Face tests", () => {

    describe("constructor", () => {

        context("with valid parameters", () => {
            it("should return a correctly initialised instance", () => {
                const id = "A";
                const numberOfTiles = 4;
                const face = new Face(id, numberOfTiles);
                expect(face.id).to.equal(id);
                expect(face.numberOfTiles).to.equal(numberOfTiles);
            });
        });

        context("with invalid parameters", () => {
            it("should throw an error", () => {
                const id = "A";
                const numberOfTiles = 13;
                expect(() => {
                    new Face(id, numberOfTiles);
                }).to.throw(Error, "Number of tiles on a Face must be one of 1,4,9!");
            });
        });

    });

});
