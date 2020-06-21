import { TilePosition } from '../../src/js/tile-position';
import { expect } from 'chai';
import 'mocha';

describe("TilePosition behaviour", () => {

    describe("if a new TilePosition", () => {

        context("is created with a valid identifier", () => {
            it("should return a correctly initialised instance", () => {
                const id = "XYZ";
                let tile = new TilePosition(id);
                expect(tile).to.be.an.instanceOf(TilePosition);
                expect(tile.id).to.equal(id);
            });
        });

    });

    describe("if a TilePosition is joined to another TilePosition", () => {

        context("with valid side names for both Tiles", () => {
            it("should be accepted", () => {
                const tile1 = new TilePosition("Tile1");
                const tile2 = new TilePosition("Tile2");
                tile1.join("A", tile2, "A");
            });
        });

        context("where the side to join from is invalid", () => {
            it("should throw an error", () => {
                const tile1 = new TilePosition("Tile1");
                const tile2 = new TilePosition("Tile2");
                expect(() => {
                    tile1.join("1", tile2, "A");
                }).to.throw(Error, "Side to join from must be one of A,B,C!");
            });
        });

        context("where the side name to join to is invalid", () => {
            it("should throw an error", () => {
                const tile1 = new TilePosition("Tile1");
                const tile2 = new TilePosition("Tile2");
                expect(() => {
                    tile1.join("A", tile2, "X");
                }).to.throw(Error, "Side to join to must be one of A,B,C!");
            });
        });

    });

});
