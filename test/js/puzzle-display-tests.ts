import valid_layout_data1 from "../valid-test-layout-data1.json";
import valid_tile_data1 from "../valid-test-tile-data1.json";
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
            const tetrahedron = getTetrahedron(valid_layout_data1.testLayoutData);
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

        context("with some tiles on it", function () {
            const window = createSVGWindow();
            const document = window.document;
            registerWindow(window, document);
            const tetrahedron = getTetrahedron(valid_layout_data1.testLayoutData);
            const displayManager = new DisplayManager(document.documentElement, valid_display1);
            const tilePool = getTilePool(valid_tile_data1.testTileData);
            const tile1 = tilePool.randomTile!;
            assert.isNotNull(tetrahedron.placeTileRandomly(tile1));
            const tile2 = tilePool.randomTile!;
            assert.isNotNull(tetrahedron.placeTileRandomly(tile2));
            const canvas = displayManager.displayPuzzle(tetrahedron);
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
            const tetrahedron = getTetrahedron(valid_layout_data1.testLayoutData);
            const displayManager = new DisplayManager(document.documentElement, valid_display1);
            const tilePool = getTilePool(valid_tile_data1.testTileData);
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
