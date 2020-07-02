import valid_config1 from "../valid-test-puzzle-data1.json";
import { getTetrahedron, getTilePool } from "../../src/js/puzzle-loader";
import { displayPuzzle } from "../../src/js/puzzle-display";
import { expect } from 'chai';
import 'mocha';
// @ts-ignore
import { createSVGWindow } from 'svgdom';
// @ts-ignore
import { registerWindow } from "@svgdotjs/svg.js";


const testDisplayData = {
        tileScale: 1,
        tilePositions: [
            {
                name: "1",
                center: {x: 0, y: 0, r: 0}
            }
        ]
    }


describe("Puzzle display functionality", function () {

    describe("displaying the test puzzle", function () {

        context("without any tiles on it", function () {
            const window = createSVGWindow();
            const document = window.document;
            registerWindow(window, document);
            const tetrahedron = getTetrahedron(valid_config1.testPuzzleData);
            const canvas = displayPuzzle(document.documentElement, tetrahedron, testDisplayData);
            console.log(canvas.svg());
            it("should have 4 faces and 4 empty tiles", function () {
                expect(document.getElementsByTagName("g")).to.have.length(8);
            });
            it("should have 4 face center points", function () {
                expect(document.getElementsByTagName("circle")).to.have.length(4);
            });
        });

        context("with tiles on it", function () {
            const window = createSVGWindow();
            const document = window.document;
            registerWindow(window, document);
            const tetrahedron = getTetrahedron(valid_config1.testPuzzleData);
            const tilePool = getTilePool(valid_config1.testPuzzleData);
            let tile = tilePool.randomTile;
            while (tile) {
                console.assert(tetrahedron.placeTileRandomly(tile));
                tile = tilePool.randomTile;
            }
            const canvas = displayPuzzle(document.documentElement, tetrahedron, testDisplayData);
            console.log(canvas.svg());
            it("should have 4 faces and 4 tiles", function () {
                expect(document.getElementsByTagName("g")).to.have.length(8);
            });
            it("should have 4 face center and 4 tile center points", function () {
                expect(document.getElementsByTagName("circle")).to.have.length(8);
            });
        });

    });

});
