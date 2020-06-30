import valid_config1 from "../valid-test-puzzle-data1.json";
import { getTetrahedron, getTilePool } from "../../src/js/puzzle-loader";
import { placeTilesRandomly } from "../../src/js/place-tiles.js";
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
            displayPuzzle(document.documentElement, tetrahedron, testDisplayData);
            it("should have 4 faces and 4 empty tiles", function () {
                const groups = document.getElementsByTagName("g");
                expect(groups.length).to.equal(8);
            });
            it("should have 4 face center points", function () {
                const circles = document.getElementsByTagName("circle");
                expect(circles.length).to.equal(4);
            });
        });

        context("with tiles on it", function () {
            const window = createSVGWindow();
            const document = window.document;
            registerWindow(window, document);
            const tetrahedron = getTetrahedron(valid_config1.testPuzzleData);
            const tilePool = getTilePool(valid_config1.testPuzzleData);
            placeTilesRandomly(tetrahedron, tilePool);
            displayPuzzle(document.documentElement, tetrahedron, testDisplayData);
            it("should have 4 faces and 4 tiles", function () {
                const groups = document.getElementsByTagName("g");
                expect(groups.length).to.equal(8);
            });
            it("should have 4 face center and 4 tile center points", function () {
                const circles = document.getElementsByTagName("circle");
                expect(circles.length).to.equal(8);
            });
        });

    });

});
