import valid_data1 from "../valid-test-puzzle-data1.json";
import valid_display1 from "../valid-test-display-data1.json";
import { getTetrahedron, getTilePool } from "../../src/js/puzzle-loader";
import { DisplayManager } from "../../src/js/puzzle-display";
import { assert, expect } from 'chai';
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
            const tetrahedron = getTetrahedron(valid_data1.testPuzzleData);
            const displayManager = new DisplayManager(document.documentElement, valid_display1);
            const canvas = displayManager.displayPuzzle(tetrahedron);
            console.log(canvas.svg());
            it("should have 4 faces, 4 empty tile positions and 1 new tile position", function () {
                expect(document.getElementsByTagName("g")).to.have.length(9);
            });
            it("should have 4 face center points", function () {
                expect(document.getElementsByTagName("circle")).to.have.length(4);
            });
        });

        context("with tiles on it", function () {
            const window = createSVGWindow();
            const document = window.document;
            registerWindow(window, document);
            const tetrahedron = getTetrahedron(valid_data1.testPuzzleData);
            const tilePool = getTilePool(valid_data1.testPuzzleData);
            const displayManager = new DisplayManager(document.documentElement, valid_display1);
            let tile = tilePool.randomTile;
            while (tile) {
                assert.isNotNull(tetrahedron.placeTileRandomly(tile));
                tile = tilePool.randomTile;
            }
            const canvas = displayManager.displayPuzzle(tetrahedron);
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
