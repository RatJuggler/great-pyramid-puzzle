import valid_layout_data1 from "../valid-test-layout-data1.json";
import valid_tile_data1 from "../valid-test-tile-data1.json";
import valid_display1 from "../valid-test-display-data1.json";
import { PuzzleComponents, PuzzleDataElements } from "../../src/js/common-data-schema";
import { getPuzzleComponents } from "../../src/js/puzzle-loader";
import { getDisplayManager } from "../../src/js/display-loader";
import { DisplayManager } from "../../src/js/display-manager";
import { PuzzleChange } from "../../src/js/puzzle-changes";
import { expect } from 'chai';
import 'mocha';
// @ts-ignore
import { createSVGWindow } from 'svgdom';
// @ts-ignore
import { registerWindow } from "@svgdotjs/svg.js";


function createDocument(): Document {
    const window = createSVGWindow();
    const document = window.document;
    registerWindow(window, document);
    return document;
}

function puzzleWithAllTiles(puzzleTypeData: PuzzleDataElements, displayManager: DisplayManager): PuzzleComponents {
    const puzzle = getPuzzleComponents(puzzleTypeData);
    puzzle.tetrahedron.tilePositions.forEach((tilePosition) => {
        tilePosition.tile = puzzle.tilePool.randomTile;
    })
    puzzle.tetrahedron.tilePositions
        .map((tilePosition) => PuzzleChange.final(tilePosition.id, tilePosition.tile.id, tilePosition.tile.getSegments()))
        .forEach((displayChange) => displayManager.display(displayChange));
    return puzzle;
}

describe("Puzzle display functionality", function () {

    const puzzleTypeData: PuzzleDataElements = {
        layoutData: valid_layout_data1.testLayoutData,
        tileData: valid_tile_data1.testTileData
    }

    describe("displaying the test puzzle", function () {

        context("without any tiles on it", function () {
            const document = createDocument();
            const displayManager = getDisplayManager(document.documentElement, valid_display1.testDisplayData);
            displayManager.initialDisplay();
            it("should have 4 faces, 4 empty tile positions and 1 new tile position", function () {
                expect(document.getElementsByTagName("g")).to.have.length(9);
            });
            it("should have 4 face center points", function () {
                expect(document.getElementsByTagName("circle")).to.have.length(4);
            });
        });

        context("with some tiles on it", function () {
            const puzzle = getPuzzleComponents(puzzleTypeData);
            const tilePosition1 = puzzle.tetrahedron.tilePositions[0];
            tilePosition1.tile = puzzle.tilePool.randomTile;
            const tilePosition2 = puzzle.tetrahedron.tilePositions[1];
            tilePosition2.tile = puzzle.tilePool.randomTile;
            const document = createDocument();
            const displayManager = getDisplayManager(document.documentElement, valid_display1.testDisplayData);
            displayManager.initialDisplay()
            puzzle.tetrahedron.tilePositions.forEach((tilePosition) => {
                let tpChange;
                if (tilePosition.isEmpty()) {
                    tpChange = PuzzleChange.empty(tilePosition.id);
                } else {
                    tpChange = PuzzleChange.final(tilePosition.id, tilePosition.tile.id, tilePosition.tile.getSegments());
                }
                displayManager.display(tpChange);
            });
            it("should have 4 faces, 2 empty tile positions, 2 tile positions with tiles and 1 new tile position", function () {
                expect(document.getElementsByTagName("g")).to.have.length(11);
            });
            it("should have 4 face center points and 2 tile center points", function () {
                expect(document.getElementsByTagName("circle")).to.have.length(6);
            });
        });

        context("with all the tiles on it", function () {
            const document = createDocument();
            const displayManager = getDisplayManager(document.documentElement, valid_display1.testDisplayData);
            displayManager.initialDisplay();
            puzzleWithAllTiles(puzzleTypeData, displayManager);
            it("should have 4 faces, 4 tile position, 4 tiles and 1 new tile position", function () {
                expect(document.getElementsByTagName("g")).to.have.length(13);
            });
            it("should have 4 face center and 4 tile center points", function () {
                expect(document.getElementsByTagName("circle")).to.have.length(8);
            });
        });

    });

    describe("DisplayChange behaviour", function () {

        context("using the Place change type on a puzzle with no tiles", function () {
            const document = createDocument();
            const displayManager = getDisplayManager(document.documentElement, valid_display1.testDisplayData);
            displayManager.initialDisplay();
            const tpChange = PuzzleChange.place("1-1", 1, "000100100100");
            displayManager.display(tpChange);
            it("should have 4 faces, 3 empty tile position, 1 tile and 1 new tile position", function () {
                expect(document.getElementsByTagName("g")).to.have.length(10);
            });
            it("should have 4 face center and 1 tile center points", function () {
                expect(document.getElementsByTagName("circle")).to.have.length(5);
            });
        });

        context("using the Rotate change type on the test puzzle with all tiles", function () {
            const document = createDocument();
            const displayManager = getDisplayManager(document.documentElement, valid_display1.testDisplayData);
            displayManager.initialDisplay();
            puzzleWithAllTiles(puzzleTypeData, displayManager);
            const tpChange = PuzzleChange.rotate("1-1");
            displayManager.display(tpChange);
            it("should have 4 faces, 4 tile position, 4 tiles and 1 new tile position", function () {
                expect(document.getElementsByTagName("g")).to.have.length(13);
            });
            it("should have 4 face center and 4 tile center points", function () {
                expect(document.getElementsByTagName("circle")).to.have.length(8);
            });
        });

        context("using the Remove change type on the test puzzle with all tiles", function () {
            const document = createDocument();
            const displayManager = getDisplayManager(document.documentElement, valid_display1.testDisplayData);
            displayManager.initialDisplay();
            puzzleWithAllTiles(puzzleTypeData, displayManager);
            const tpChange = PuzzleChange.remove("1-1", 1, "000100100100");
            displayManager.display(tpChange);
            it("should have 4 faces, 4 tile position, 4 tiles and 1 new tile position", function () {
                expect(document.getElementsByTagName("g")).to.have.length(12);
            });
            it("should have 4 face center and 4 tile center points", function () {
                expect(document.getElementsByTagName("circle")).to.have.length(7);
            });
        });

    });

});
