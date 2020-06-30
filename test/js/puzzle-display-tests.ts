import { testPuzzle } from "../../src/js/test-puzzle";
import { getTetrahedron, getTilePool } from "../../src/js/puzzle-loader";
import { placeTilesRandomly } from "../../src/js/place-tiles.js";
import { displayPuzzle } from "../../src/js/puzzle-display";
import 'mocha';
// @ts-ignore
import { createSVGWindow } from 'svgdom';
// @ts-ignore
import { registerWindow } from "@svgdotjs/svg.js";


describe("Puzzle display functionality", function () {

    describe("displaying the test puzzle", function () {

        context("without any tiles on it", function () {
            const window = createSVGWindow();
            const document = window.document;
            registerWindow(window, document);
            it("should create the display", function () {
                const tetrahedron = getTetrahedron(testPuzzle.puzzleData);
                const canvas = displayPuzzle(document.documentElement, tetrahedron, testPuzzle.displayData);
                console.log(canvas.svg());
            });
        });

        context("with tiles on it", function () {
            const window = createSVGWindow();
            const document = window.document;
            registerWindow(window, document);
            it("should create the display", function () {
                const tetrahedron = getTetrahedron(testPuzzle.puzzleData);
                const tilePool = getTilePool(testPuzzle.puzzleData);
                placeTilesRandomly(tetrahedron, tilePool);
                const canvas = displayPuzzle(document.documentElement, tetrahedron, testPuzzle.displayData);
                console.log(canvas.svg());
            });
        });

    });

});
