import { TilePosition } from '../../src/js/tile-position';
import { Face } from "../../src/js/face";
import { TilePositionData } from "../../src/js/puzzle-data-schema";
import { expect } from 'chai';
import 'mocha';


describe("TilePosition behaviour", () => {

    let oneTilePositions: TilePositionData[]  = [
        {"position": "1", "joins": []}
    ];
    let faceWithOneTilePosition = new Face("1", 1, oneTilePositions);

    describe("if a new TilePosition is created", () => {

        context("with a valid identifier", () => {
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
                tile1.join("A", "A", tile2, faceWithOneTilePosition);
            });
        });

        context("where the side to join from is invalid", () => {
            it("should throw an error", () => {
                const tile1 = new TilePosition("Tile1");
                const tile2 = new TilePosition("Tile2");
                expect(() => {
                    tile1.join("1", "A", tile2, faceWithOneTilePosition);
                }).to.throw(Error, "Side to join from must be one of A,B,C!");
            });
        });

        context("where the side name to join to is invalid", () => {
            it("should throw an error", () => {
                const tile1 = new TilePosition("Tile1");
                const tile2 = new TilePosition("Tile2");
                expect(() => {
                    tile1.join("A", "X", tile2, faceWithOneTilePosition);
                }).to.throw(Error, "Side to join to must be one of A,B,C!");
            });
        });

    });

    describe("if a Tile is placed at a position (without using matching)", () => {

        context("and the position is empty", () => {
            it("should be placed accepted", () => {

            });
        });

        context("and the position is already occupied by a Tile", () => {
            it("should return an error", () => {

            });
        });

    });

});
