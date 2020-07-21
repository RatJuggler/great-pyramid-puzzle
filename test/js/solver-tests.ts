import valid_layout_data from "../valid-test-layout-data1.json";
import invalid_tile_data from "../invalid-tile-data3.json";
import { getPuzzleComponents } from "../../src/js/puzzle-loader";
import { SolverBase, NoMatchingSolver, BruteForceSolver } from "../../src/js/solver";
import { Tetrahedron } from "../../src/js/tetrahedron";
import { Tile } from "../../src/js/tile";
import { TilePool } from "../../src/js/tile-pool";
import { TilePosition } from "../../src/js/tile-position";
import { TilePositionChange } from "../../src/js/tile-position-change";
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
            const components = getPuzzleComponents(VALID_TEST_PUZZLE);
            const solver = new MockSolver(components.tetrahedron, components.tilePool);
            it("should return null", function () {
                expect(solver.nextState()).to.be.null;
            });
        })
    });

});


describe("NoMatchingSolver behaviour", function () {

    describe("when #getTileSelection() is called", function () {

        context("with an invalid tile selection", function () {
            const components = getPuzzleComponents(VALID_TEST_PUZZLE);
            const solver = new NoMatchingSolver(components.tetrahedron, components.tilePool,
                "error", "Random", "None");
            it("should throw an error", function () {
                expect(function () {
                    solver.getTileSelection();
                }).to.throw(Error, "Invalid tile selection option!");
            });
        });

        context("with the Tile Selection argument 'Random'", function () {
            const components = getPuzzleComponents(VALID_TEST_PUZZLE);
            const solver = new NoMatchingSolver(components.tetrahedron, components.tilePool,
                "Random", "Random", "None");
            const result = solver.getTileSelection();
            it("should return a random Tile", function () {
                expect(result).to.be.an.instanceOf(Tile);
            });
        });

        context("with the Tile Selection argument 'Sequential'", function () {
            const components = getPuzzleComponents(VALID_TEST_PUZZLE);
            const solver = new NoMatchingSolver(components.tetrahedron, components.tilePool,
                "Sequential", "Random", "None");
            const tile = solver.getTileSelection();
            it("should return the first sequential Tile", function () {
                expect(tile.id).to.equal(1);
            });
        });

        context("with the Tile Selection argument 'Test'", function () {
            const components = getPuzzleComponents(VALID_TEST_PUZZLE);
            const solver = new NoMatchingSolver(components.tetrahedron, components.tilePool,
                "Test", "Random", "None");
            const tile = solver.getTileSelection();
            it("should return the test Tile", function () {
                expect(tile.id).to.equal(0);
            });
        });

    });

    describe("if #placeTile() is called", function () {

        context("with an invalid tile placement", function () {
            const components = getPuzzleComponents(VALID_TEST_PUZZLE);
            const solver = new NoMatchingSolver(components.tetrahedron, components.tilePool,
                "Random", "error", "None");
            it("should throw an error", function () {
                expect(function () {
                    solver.placeTile(components.tilePool.nextTile!);
                }).to.throw(Error, "Invalid tile placement option!");
            });
        });

        context("with an invalid tile rotation", function () {
            const components = getPuzzleComponents(VALID_TEST_PUZZLE);
            const solver = new NoMatchingSolver(components.tetrahedron, components.tilePool,
                "Random", "Random", "error");
            it("should throw an error", function () {
                expect(function () {
                    solver.tileRotations();
                }).to.throw(Error, "Invalid tile rotation option!");
            });
        });

        context("with valid placement options", function () {
            const components = getPuzzleComponents(VALID_TEST_PUZZLE);
            const solver = new NoMatchingSolver(components.tetrahedron, components.tilePool,
                "Sequential", "Sequential", "None");
            const tileToPlace = components.tilePool.nextTile!
            const result = solver.placeTile(tileToPlace);
            it("should return an updated TilePosition", function () {
                expect(result).to.be.an.instanceOf(TilePosition);
                expect(result.id).to.equal("1-1");
                expect(result.tile).to.eql(tileToPlace);
            });
        });

    });

    describe("if #nextState() is called", function () {

        context("on an instance instantiated for the test puzzle", function () {
            const components = getPuzzleComponents(VALID_TEST_PUZZLE);
            const solver = new NoMatchingSolver(components.tetrahedron, components.tilePool,
                "Random", "Random", "None");
            it("should first return an instance of TilePositionChange", function () {
                expect(solver.nextState()).to.be.an.instanceOf(TilePositionChange);
            });
            it("should then return another instance of TilePositionChange", function () {
                expect(solver.nextState()).to.be.an.instanceOf(TilePositionChange);
            });
            it("should then return another instance of TilePositionChange", function () {
                expect(solver.nextState()).to.be.an.instanceOf(TilePositionChange);
            });
            it("should then return another instance of TilePositionChange", function () {
                expect(solver.nextState()).to.be.an.instanceOf(TilePositionChange);
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
            const components = getPuzzleComponents(VALID_TEST_PUZZLE);
            const solver = new BruteForceSolver(components.tetrahedron, components.tilePool);
            it("should return null", function () {
                expect(solver.nextState()).to.be.null;
            });
        })
    });

});
