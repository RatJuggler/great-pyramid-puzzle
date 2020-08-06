import valid_layout_data from "../data/valid-test-layout-data1.json";
import invalid_tile_data from "../data/invalid-tile-data3.json";
import { getPuzzleComponents, buildTetrahedron } from "../../../src/js/puzzle-loader";
import { PuzzleComponents } from "../../../src/js/common-data-schema";
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

    let components: PuzzleComponents;
    let solver: MockSolver;

    beforeEach(function () {
        components = getPuzzleComponents(VALID_TEST_PUZZLE);
        solver = new MockSolver(components.tetrahedron, components.tilePool);
    });

    describe("if a new MockSolver is created", function () {

        context("and there aren't enough Tiles to cover the Tetrahedron", function () {
            it("should throw an error", function () {
                const tilePool = new TilePool(invalid_tile_data.testTileData.totalNumberOfTiles, invalid_tile_data.testTileData.tiles);
                const tetrahedron = buildTetrahedron(valid_layout_data.testLayoutData);
                expect(function () {
                    new MockSolver(tetrahedron, tilePool);
                }).to.throw(Error, "There must be enough Tiles to cover the Tetrahedron!");
            });
        });

    });

    describe("if #initialState() is called", function () {

        context("on a MockSolver instantiated with the test puzzle", function () {
            it("should return an array of tile position changes with an entry for each tile start position and puzzle position", function () {
                const result = solver.initialState();
                expect(result).to.be.instanceof(Array);
                expect(result.length).to.equal(components.tilePool.tileCount + components.tetrahedron.tilePositionCount);
            });
        });

    });

    describe("if #nextState() is called", function () {

        context("on a MockSolver instantiated with the test puzzle", function () {
            it("should return an instance of PuzzleChange with a type if Initial", function () {
                const result = solver.nextState();
                expect(result).to.be.an.instanceof(PuzzleChange);
                expect(result).to.equal(PuzzleChange.INITIAL);
            });
        });

    });

    describe("if #finalState() is called", function () {

        context("on a MockSolver with all the tile positions filled", function () {
            it("should return an array of puzzle changes with an entry for each tile position", function () {
                components.tetrahedron.tilePositions.forEach((tilePosition) => {
                    tilePosition.state.tile = components.tilePool.randomTile;
                })
                const result = solver.currentState();
                expect(result).to.be.instanceof(Array);
                expect(result.length).to.equal(components.tetrahedron.tilePositionCount);
            });
        });

    });

});
