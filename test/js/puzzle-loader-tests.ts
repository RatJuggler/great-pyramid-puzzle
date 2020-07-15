import layout_data from "../valid-test-layout-data1.json";
import tile_data from "../valid-test-tile-data1.json";
import invalid_tile_data from "../invalid-tile-data3.json";
import display_data from "../valid-test-display-data1.json";
import { PuzzleDataElements } from "../../src/js/common-data-schema";
import { getPuzzleComponents } from "../../src/js/puzzle-loader";
import { expect } from 'chai';
import 'mocha';


describe("if #getPuzzleComponents() is called", function () {

    context("with a valid set of data elements", function () {
        const validTestPuzzle: PuzzleDataElements = {
            layoutData: layout_data.testLayoutData,
            tileData: tile_data.testTileData,
            displayData: display_data.testDisplayData
        }
        const result = getPuzzleComponents(validTestPuzzle, "test");
        it("should return a valid set of components", function () {
            expect(result).to.have.property("tilePool");
            expect(result).to.have.property("tetrahedron");
            expect(result).to.have.property("displayManager");
        });
    });

    context("with invalid set of data elements", function () {
        const validTestPuzzle: PuzzleDataElements = {
            layoutData: layout_data.testLayoutData,
            tileData: invalid_tile_data.testTileData,
            displayData: display_data.testDisplayData
        }
        it("should throw an error", function () {
            expect(function () {
                getPuzzleComponents(validTestPuzzle, "test");
            }).to.throw(Error, "There must be enough Tiles to cover the Tetrahedron!");
        });
    });

});
