import { Tile } from '../../src/js/tile';
import { TileData } from "../../src/js/puzzle-data-schema";
import { expect } from 'chai';
import 'mocha';


describe("Tile behaviour", () => {

    describe("if a new Tile is created", () => {

        context("with a valid identifier", () => {
            it("should return a correctly initialised instance", () => {
                const tileData: TileData = {
                    "tile": "TestTile",
                    "sideA": "SegmentData",
                    "sideB": "SegmentData",
                    "sideC": "SegmentData"
                };
                let tile = new Tile(tileData);
                expect(tile).to.be.an.instanceOf(Tile);
                expect(tile.id).to.equal(tileData.tile);
            });
        });

    });

});