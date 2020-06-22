import { Tile } from '../../src/js/tile';
import { TileData } from "../../src/js/puzzle-data-schema";
import { expect } from 'chai';
import 'mocha';


describe("Tile behaviour", () => {

    describe("if a new Tile is created", () => {

        context("with valid Tile data", () => {
            it("should return a correctly initialised instance", () => {
                const tileData: TileData = {
                    "tile": "TestTile",
                    "sideA": "0001",
                    "sideB": "0010",
                    "sideC": "0100"
                };
                let tile = new Tile(tileData);
                expect(tile).to.be.an.instanceOf(Tile);
                expect(tile.id).to.equal(tileData.tile);
            });
        });

        context("with an invalid Tile segment data length", () => {
            it("should throw an error", () => {
                const tileData: TileData = {
                    "tile": "TestTile",
                    "sideA": "0001",
                    "sideB": "00010",
                    "sideC": "0100"
                };
                expect(() => {
                    new Tile(tileData);
                }).to.throw(Error, "Segment coding should be four characters, found '00010'!");
            });
        });

        context("with an invalid Tile segment data coding", () => {
            it("should throw an error", () => {
                const tileData: TileData = {
                    "tile": "TestTile",
                    "sideA": "0001",
                    "sideB": "0010",
                    "sideC": "01A0"
                };
                expect(() => {
                    new Tile(tileData);
                }).to.throw(Error, "Segment coding can only contain '1' or '0', found '01A0'!");
            });
        });

    });

});