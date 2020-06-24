import { Tile } from '../../src/js/tile';
import { TileData } from "../../src/js/puzzle-data-schema";
import { expect } from 'chai';
import 'mocha';


describe("Tile behaviour", function () {

    describe("if a new Tile is created", function () {

        context("with valid Tile data", function () {
            it("should return a correctly initialised instance", function () {
                const tileData: TileData = {
                    "tile": "TestTile",
                    "sideA": "0001",
                    "sideB": "0010",
                    "sideC": "0100"
                };
                let tile = new Tile(tileData);
                expect(tile).to.be.an.instanceOf(Tile);
                const expectedToString = "Id: TestTile, Side-A: 0001, Side-B: 0010, Side-C: 0100";
                expect(tile.toString()).to.equal(expectedToString);
            });
        });

        context("with an invalid Tile segment data length", function () {
            it("should throw an error", function () {
                const tileData: TileData = {
                    "tile": "TestTile",
                    "sideA": "0001",
                    "sideB": "00010",
                    "sideC": "0100"
                };
                expect(function () {
                    new Tile(tileData);
                }).to.throw(Error, "Segment coding should be four characters, found '00010'!");
            });
        });

        context("with an invalid Tile segment data coding", function () {
            it("should throw an error", function () {
                const tileData: TileData = {
                    "tile": "TestTile",
                    "sideA": "0001",
                    "sideB": "0010",
                    "sideC": "01A0"
                };
                expect(function () {
                    new Tile(tileData);
                }).to.throw(Error, "Segment coding can only contain '1' or '0', found '01A0'!");
            });
        });

    });

});
