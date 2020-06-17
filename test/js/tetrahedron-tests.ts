import { Tetrahedron } from '../../src/js/tetrahedron';
import { Tile } from "../../src/js/tile";
import { assert, expect } from 'chai';
import 'mocha';

describe("Tetrahedron behaviour", () => {

    describe("a new Tetrahedron", () => {

        context("with valid parameters", () => {
            it("should return a correctly initialised instance", () => {
                const name = "ValidTetrahedron";
                const numberOfTiles = 4;
                const puzzle = new Tetrahedron(name, numberOfTiles);
                expect(puzzle.name).to.equal(name);
                expect(puzzle.faces.length).to.equal(Tetrahedron.faceNames.length);
                puzzle.faces.forEach(face => expect(face.numberOfTiles).to.equal(numberOfTiles));
            });
        });

        context("with invalid parameters", () => {
            it("should throw an error", () => {
                expect(() => {
                    new Tetrahedron("InvalidTetrahedron", 13);
                }).to.throw(Error, "Number of tiles on a Face must be one of 1,4,9!");
            });
        });

    });

    describe("adding a Tile", () => {

        context("to an empty Tetrahedron", () => {
            it("it should always be added", () => {
                const puzzle = new Tetrahedron("EmptyTetrahedron", 1);
                const tile = new Tile("123")
                puzzle.addTile(tile);
                assert.fail("Behavior not implemented...");
            })
        });

        context("to a full Tetrahedron", () => {
            it("it should always be rejected", () => {
                const puzzle = new Tetrahedron("FullTetrahedron", 1);
                const tile = new Tile("123")
                puzzle.addTile(tile);
                assert.fail("Behavior not implemented...");
            });
        });

        context("to a Tetrahedron with existing Tiles which match", () => {
           it("should be added", () => {
               assert.fail("Behavior not implemented...");
           });
        });

        context("to a Tetrahedron with existing Tiles which don't match", () => {
            it("should be rejected", () => {
                assert.fail("Behavior not implemented...");
            });
        });

    });

});
