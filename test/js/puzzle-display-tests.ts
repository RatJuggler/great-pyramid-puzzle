import { testPuzzle } from "../../src/js/test-puzzle";
import { displayPuzzle } from "../../src/js/puzzle-display";
import { loadPuzzleAndPlaceTiles } from "../../src/js/puzzle-loader";
import 'mocha';
// @ts-ignore
import { createSVGWindow } from 'svgdom';
// @ts-ignore
import { registerWindow } from "@svgdotjs/svg.js";


describe("Puzzle display functionality", function () {

    describe("displaying the test puzzle", function () {

        context("with valid Tile data", function () {
            it("should create the display", function () {
                const window = createSVGWindow();
                const document = window.document;
                // const document = createSVGDocument();
                registerWindow(window, document);
                const canvas = displayPuzzle(document.documentElement, loadPuzzleAndPlaceTiles(testPuzzle.puzzleData), testPuzzle.displayData);
                console.log(canvas.svg());
            });
        });

    });

});
