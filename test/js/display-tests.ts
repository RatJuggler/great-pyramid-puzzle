import valid_layout_data1 from "../valid-test-layout-data1.json";
import valid_tile_data1 from "../valid-test-tile-data1.json";
import valid_display1 from "../valid-test-display-data1.json";
import { PuzzleDataElements } from "../../src/js/common-data-schema";
import { getPuzzleComponents } from "../../src/js/puzzle-loader";
import { getDisplayManager } from "../../src/js/display-loader";
import { TileChange, TilePositionChange } from "../../src/js/tile-position-change";
import { assert, expect } from 'chai';
import 'mocha';
// @ts-ignore
import { createSVGWindow } from 'svgdom';
// @ts-ignore
import { registerWindow } from "@svgdotjs/svg.js";


describe("Puzzle display functionality", function () {

    const puzzleTypeData: PuzzleDataElements = {
        layoutData: valid_layout_data1.testLayoutData,
        tileData: valid_tile_data1.testTileData
    }

    describe("displaying the test puzzle", function () {

        context("without any tiles on it", function () {
            const window = createSVGWindow();
            const document = window.document;
            registerWindow(window, document);
            const displayManager = getDisplayManager(document.documentElement, valid_display1.testDisplayData);
            const canvas = displayManager.initialDisplay();
            console.log(canvas.svg());
            it("should have 4 faces, 4 empty tile positions and 1 new tile position", function () {
                expect(document.getElementsByTagName("g")).to.have.length(9);
            });
            it("should have 4 face center points", function () {
                expect(document.getElementsByTagName("circle")).to.have.length(4);
            });
        });

        context("with some tiles on it", function () {
            const window = createSVGWindow();
            const document = window.document;
            registerWindow(window, document);
            const puzzle = getPuzzleComponents(puzzleTypeData);
            const tile1 = puzzle.tilePool.randomTile;
            assert.isNotNull(puzzle.tetrahedron.placeTileRandomly(tile1));
            const tile2 = puzzle.tilePool.randomTile;
            assert.isNotNull(puzzle.tetrahedron.placeTileRandomly(tile2));
            const displayManager = getDisplayManager(document.documentElement, valid_display1.testDisplayData);
            const canvas = displayManager.initialDisplay()
            puzzle.tetrahedron.tilePositions.forEach((tilePosition) => {
                let tpChange;
                if (tilePosition.isEmpty()) {
                    tpChange = new TilePositionChange("Empty", tilePosition.id);
                } else {
                    tpChange = new TileChange("Final", tilePosition.id, tilePosition.tile.id, tilePosition.getRotatedSegments());
                }
                displayManager.display(tpChange);
            });
            console.log(canvas.svg());
            it("should have 4 faces, 2 empty tile positions, 2 tile positions with tiles and 1 new tile position", function () {
                expect(document.getElementsByTagName("g")).to.have.length(11);
            });
            it("should have 4 face center points and 2 tile center points", function () {
                expect(document.getElementsByTagName("circle")).to.have.length(6);
            });
        });

        context("with all the tiles on it", function () {
            const window = createSVGWindow();
            const document = window.document;
            registerWindow(window, document);
            const puzzle = getPuzzleComponents(puzzleTypeData)
            while (!puzzle.tilePool.isEmpty) {
                let tile = puzzle.tilePool.randomTile;
                assert.isNotNull(puzzle.tetrahedron.placeTileRandomly(tile));
            }
            const displayManager = getDisplayManager(document.documentElement, valid_display1.testDisplayData);
            const canvas = displayManager.initialDisplay();
            puzzle.tetrahedron.tilePositions
                .map((tilePosition) =>
                    new TileChange("Final", tilePosition.id, tilePosition.tile.id, tilePosition.getRotatedSegments()))
                .forEach((displayChange) => displayManager.display(displayChange));
            console.log(canvas.svg());
            it("should have 4 faces, 4 tile position, 4 tiles and 1 new tile position", function () {
                expect(document.getElementsByTagName("g")).to.have.length(13);
            });
            it("should have 4 face center and 4 tile center points", function () {
                expect(document.getElementsByTagName("circle")).to.have.length(8);
            });
        });

    });

});
