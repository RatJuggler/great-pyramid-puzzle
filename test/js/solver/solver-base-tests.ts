import valid_layout_data from "../data/valid-test-layout-data1.json";
import invalid_tile_data from "../data/invalid-tile-data3.json";
import { getPuzzleComponents, buildTetrahedron } from "../../../src/js/puzzle-loader";
import { SolverBase } from "../../../src/js/solver/solver-base";
import { TilePool } from "../../../src/js/puzzle/tile-pool";
import { PuzzleChange } from "../../../src/js/puzzle-changes";
import { expect } from 'chai';
import 'mocha';
// @ts-ignore
import { VALID_TEST_PUZZLE } from "../common-test-data";


class MockSolver extends SolverBase {

    nextState(): PuzzleChange {
        return PuzzleChange.INITIAL;
    }

    forceNextState(): PuzzleChange {
        return PuzzleChange.COMPLETED;
    }

}


describe("SolverBase behaviour using MockSolver", function () {

    describe("if a new MockSolver is created", function () {

        context("and there aren't enough Tiles to cover the Tetrahedron", function () {
            const tilePool = new TilePool(invalid_tile_data.testTileData.totalNumberOfTiles, invalid_tile_data.testTileData.tiles);
            const tetrahedron = buildTetrahedron(valid_layout_data.testLayoutData);
            it("should throw an error", function () {
                expect(function () {
                    new MockSolver(tetrahedron, tilePool);
                }).to.throw(Error, "There must be enough Tiles to cover the Tetrahedron!");
            });
        });

    });

    describe("if #initialState() is called", function () {

        context("on a MockSolver instantiated with the test puzzle", function () {
            const components = getPuzzleComponents(VALID_TEST_PUZZLE);
            const solver = new MockSolver(components.tetrahedron, components.tilePool);
            const result = solver.initialState();
            it("should return an array of tile position changes", function () {
                expect(result).to.be.instanceof(Array);
            });
            it("should contain an entry for each tile start position and puzzle position", function () {
                expect(result.length).to.equal(components.tilePool.tileCount + components.tetrahedron.tilePositionCount);
            });
        });

    });

    describe("if #nextState() is called", function () {

        context("on a MockSolver instantiated with the test puzzle", function () {
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

        context("on a MockSolver with all the tile positions filled", function () {
            const components = getPuzzleComponents(VALID_TEST_PUZZLE);
            const solver = new MockSolver(components.tetrahedron, components.tilePool);
            components.tetrahedron.tilePositions.forEach((tilePosition) => {
                tilePosition.state.tile = components.tilePool.randomTile;
            })
            const result = solver.currentState();
            it("should return an array of puzzle changes", function () {
                expect(result).to.be.instanceof(Array);
            });
            it("should contain an entry for each tile position", function () {
                expect(result.length).to.equal(components.tetrahedron.tilePositionCount);
            });
        });

    });

});
