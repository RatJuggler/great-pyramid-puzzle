import valid_layout_data from "../valid-test-layout-data1.json";
import invalid_tile_data from "../invalid-tile-data3.json";
import { getPuzzleComponents } from "../../src/js/puzzle-loader";
import { SolverBase, NoMatchingSolver, BruteForceSolver } from "../../src/js/solver";
import { Tetrahedron } from "../../src/js/tetrahedron";
import { TilePool } from "../../src/js/tile-pool";
import { TilePosition } from "../../src/js/tile-position";
import { expect } from 'chai';
import 'mocha';
// @ts-ignore
import { VALID_TEST_PUZZLE } from "./common-test-data";


class MockSolver extends SolverBase {}


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

    describe("if the #nextState() placeholder is called", function () {

        context("on a properly instantiated instance", function () {
            const components = getPuzzleComponents(VALID_TEST_PUZZLE, "test");
            const solver = new MockSolver(components.tetrahedron, components.tilePool);
            it("should return null", function () {
                expect(solver.nextState()).to.be.null;
            });
        })
    });

});


describe("NoMatchingSolver behaviour", function () {

    describe("if #nextState() is called", function () {

        context("on an instance instantiated for the test puzzle", function () {
            const components = getPuzzleComponents(VALID_TEST_PUZZLE, "test");
            const solver = new NoMatchingSolver(components.tetrahedron, components.tilePool,
                "Random", "Random", "Random");
            it("should first return an instance of TilePosition", function () {
                expect(solver.nextState()).to.be.an.instanceOf(TilePosition);
            });
            it("should then return another instance of TilePosition", function () {
                expect(solver.nextState()).to.be.an.instanceOf(TilePosition);
            });
            it("should then return another instance of TilePosition", function () {
                expect(solver.nextState()).to.be.an.instanceOf(TilePosition);
            });
            it("should then return another instance of TilePosition", function () {
                expect(solver.nextState()).to.be.an.instanceOf(TilePosition);
            });
            it("should then finally return null", function () {
                expect(solver.nextState()).to.be.null;
            });
        })
    });

});


describe("BruteForceSolver behaviour", function () {

    describe("if #nextState() is called", function () {

        context("on a solved puzzle", function () {
            const components = getPuzzleComponents(VALID_TEST_PUZZLE, "test");
            const solver = new BruteForceSolver(components.tetrahedron, components.tilePool);
            it("should return null", function () {
                expect(solver.nextState()).to.be.null;
            });
        })
    });

});
