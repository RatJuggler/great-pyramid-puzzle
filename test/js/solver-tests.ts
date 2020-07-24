import valid_layout_data from "../valid-test-layout-data1.json";
import invalid_tile_data from "../invalid-tile-data3.json";
import { getPuzzleComponents } from "../../src/js/puzzle-loader";
import { SolverBase } from "../../src/js/solver";
import { Tetrahedron } from "../../src/js/tetrahedron";
import { TilePool } from "../../src/js/tile-pool";
import { PuzzleChange } from "../../src/js/puzzle-changes";
import { assert, expect } from 'chai';
import 'mocha';
// @ts-ignore
import { VALID_TEST_PUZZLE } from "./common-test-data";


class MockSolver extends SolverBase {

    nextState(): PuzzleChange {
        return PuzzleChange.INITIAL;
    }

}


describe("SolverBase behaviour using MockSolver", function () {

    describe("if a new SolverBase is created", function () {

        context("and there aren't enough Tiles to cover the Tetrahedron", function () {
            const tilePool = new TilePool(invalid_tile_data.testTileData.totalNumberOfTiles, invalid_tile_data.testTileData.tiles);
            const tetrahedron = new Tetrahedron(valid_layout_data.testLayoutData.puzzle,
                valid_layout_data.testLayoutData.numberOfTilesPerFace, valid_layout_data.testLayoutData.faces);
            it("should throw an error", function () {
                expect(function () {
                    new MockSolver(tetrahedron, tilePool);
                }).to.throw(Error, "There must be enough Tiles to cover the Tetrahedron!");
            });
        });

    });

    describe("if the #nextState() mock is called", function () {

        context("on a properly instantiated instance", function () {
            const components = getPuzzleComponents(VALID_TEST_PUZZLE);
            const solver = new MockSolver(components.tetrahedron, components.tilePool);
            const result = solver.nextState();
            it("should return an instance of PuzzleChange", function () {
                expect(result).to.be.an.instanceof(PuzzleChange);
            });
            it("should have a type of Test", function () {
                expect(result).to.equal(PuzzleChange.INITIAL);
            });
        });

    });

    describe("if #finalState() is called", function () {

        context("on a puzzle with all tile positions filled", function () {
            const components = getPuzzleComponents(VALID_TEST_PUZZLE);
            const solver = new MockSolver(components.tetrahedron, components.tilePool);
            components.tetrahedron.tilePositions.forEach((tilePosition) => {
                let tile = components.tilePool.randomTile;
                assert.isNotNull(tilePosition.placeTile(tile));
            })
            const result = solver.finalState();
            it("should return an array of tile position changes", function () {
                expect(result).to.be.instanceof(Array);
            });
            it("the array contain an entry for each tile position", function () {
                expect(result.length).to.equal(components.tetrahedron.tilePositionCount);
            });
        });

    });

});
