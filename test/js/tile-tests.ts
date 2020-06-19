import { Tile } from '../../src/js/tile';
import { expect } from 'chai';
import 'mocha';

describe("Tile behaviour", () => {

    describe("if a new Tile", () => {

        context("is created with a valid identifier", () => {
            it("should return a correctly initialised instance", () => {
                const id = "XYZ";
                let tile = new Tile(id);
                expect(tile).to.be.an.instanceOf(Tile);
                expect(tile.id).to.equal(id);
            });
        });

    });

    describe("if a Tile is joined to another Tile", () => {

        context("with valid side names for both Tiles", () => {
            it("should be accepted", () => {
                const tile1 = new Tile("Tile1");
                const tile2 = new Tile("Tile2");
                tile1.join("A", tile2, "A");
            });
        });

        context("where the side to join from is invalid", () => {
            it("should throw an error", () => {
                const tile1 = new Tile("Tile1");
                const tile2 = new Tile("Tile2");
                expect(() => {
                    tile1.join("1", tile2, "A");
                }).to.throw(Error, "Side to join from must be one of A,B,C!");
            });
        });

        context("where the side name to join to is invalid", () => {
            it("should throw an error", () => {
                const tile1 = new Tile("Tile1");
                const tile2 = new Tile("Tile2");
                expect(() => {
                    tile1.join("A", tile2, "X");
                }).to.throw(Error, "Side to join to must be one of A,B,C!");
            });
        });

    });

});
