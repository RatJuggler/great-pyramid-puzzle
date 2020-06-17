import { Tetrahedron } from '../../src/js/tetrahedron';
import { expect } from 'chai';
import 'mocha';

describe("Tetrahedron behaviour", () => {

    describe("a new Tetrahedron", () => {

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

    describe("adding a Tile", () => {

        context("to an empty Tetrahedron", () => {
            it("it should always be added", () => {

            })
        });

        context("to a full Tetrahedron", () => {
            it("it should always be rejected", () => {

            });
        });

        context("to a Tetrahedron with existing Tiles which match", () => {
           it("should be added", () => {

           });
        });

        context("to a Tetrahedron with existing Tiles which don't match", () => {
            it("should be rejected", () => {

            });
        });

    });

});
