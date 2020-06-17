import { Face } from '../../src/js/face';
import { expect } from 'chai';
import 'mocha';

describe("Face tests", () => {

    describe("constructor", () => {

        context("with valid parameters", () => {
            it("should return a correctly initialised instance", () => {
                const id = "A";
                const number_of_tiles = 4;
                const face = new Face(id, number_of_tiles);
                expect(face.id).to.equal(id);
                expect(face.numberOfTiles).to.equal(number_of_tiles);
            });
        });

        context("with invalid parameters", () => {
            it("should throw an error", () => {
                const id = "A";
                const number_of_tiles = 13;
                expect(() => {
                    new Face(id, number_of_tiles);
                }).to.throw(Error, "Number of tiles on a Face must be one of 1,4,9!");
            });
        });

    });

});
