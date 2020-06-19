import { Tetrahedron } from '../../src/js/tetrahedron';
import { expect } from 'chai';
import 'mocha';

describe("Tetrahedron behaviour", () => {

    describe("a new Tetrahedron", () => {

        context("with valid parameters", () => {
            it("should return a correctly initialised instance", () => {
                const name = "ValidTetrahedron";
                const tilesPerFace = 4;
                const puzzle = new Tetrahedron(name, tilesPerFace);
                expect(puzzle.name).to.equal(name);
            });
        });

        context("with invalid parameters", () => {
            it("should throw an error", () => {
                expect(() => {
                    new Tetrahedron("InvalidTetrahedron", 16);
                }).to.throw(Error, "Number of tiles on a Face must be one of 1,4,9!");
            });
        });

    });

});
