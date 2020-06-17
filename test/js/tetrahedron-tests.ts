import { Tetrahedron } from '../../src/js/tetrahedron';
import { expect } from 'chai';
import 'mocha';

describe("Tetrahedron tests", () => {

    describe("constructor", () => {

        context("with valid parameters", () => {
            it("should return a correctly initialised instance", () => {
                const name = "Name1";
                const numberOfTiles = 4;
                const puzzle = new Tetrahedron(name, numberOfTiles);
                expect(puzzle.name).to.equal(name);
                expect(puzzle.faces.length).to.equal(Tetrahedron.faceIds.length);
                puzzle.faces.forEach(face => expect(face.numberOfTiles).to.equal(numberOfTiles));
            });
        });

        context("with invalid parameters", () => {
            it("should throw an error", () => {
                const name = "Name2";
                const numberOfTiles = 13;
                expect(() => {
                    new Tetrahedron(name, numberOfTiles);
                }).to.throw(Error, "Number of tiles on a Face must be one of 1,4,9!");
            });
        });

    });

});
