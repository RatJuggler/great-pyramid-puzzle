import valid_layout_data from "../valid-test-layout-data1.json";
import invalid_tile_data from "../invalid-tile-data3.json";
import { getPuzzleComponents } from "../../src/js/puzzle-loader";
import { SolverBase, NoMatchingSolver, BruteForceSolver } from "../../src/js/solver";
import { Tetrahedron } from "../../src/js/tetrahedron";
import { Tile } from "../../src/js/tile";
import { TilePool } from "../../src/js/tile-pool";
import { PuzzleChange, TilePositionChange, TileChange } from "../../src/js/puzzle-changes";
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

    describe("if #nextState() is called on an improperly instantiated instance", function () {

        context("with an invalid tile placement", function () {
            const components = getPuzzleComponents(VALID_TEST_PUZZLE);
            it("should throw an error", function () {
                expect(function () {
                    new NoMatchingSolver(components.tetrahedron, components.tilePool,
                        "Random", "error", "None");
                }).to.throw(Error, "Invalid tile placement option!");
            });
        });

        context("with an invalid tile rotation", function () {
            const components = getPuzzleComponents(VALID_TEST_PUZZLE);
            const solver = new NoMatchingSolver(components.tetrahedron, components.tilePool,
                "Random", "Random", "error");
            it("should throw an error", function () {
                expect(function () {
                    solver.nextState();
                }).to.throw(Error, "Invalid tile rotation option!");
            });
        });

    });

    describe("if #nextState() is called on an instance properly instantiated with the text puzzle", function () {

        const components = getPuzzleComponents(VALID_TEST_PUZZLE);
        const solver = new NoMatchingSolver(components.tetrahedron, components.tilePool,
            "Sequential", "Sequential", "None");

        context("for the first time", function () {
            const result = solver.nextState() as TileChange;
            it("should return an instance of TileChange for position 1-1 with tile 1", function () {
                expect(result).to.be.an.instanceOf(TileChange);
                expect(result.tilePositionId).to.equal("1-1");
                expect(result.tileId).to.equal(1);
            });
        });
        context("for the second time", function () {
            const result = solver.nextState() as TileChange;
            it("should return an instance of TileChange for position 2-1 with tile 2", function () {
                expect(result).to.be.an.instanceOf(TileChange);
                expect(result.tilePositionId).to.equal("2-1");
                expect(result.tileId).to.equal(2);
            });
        });
        context("for the third time", function () {
            const result = solver.nextState() as TileChange;
            it("should return an instance of TileChange for position 3-1 with tile 3", function () {
                expect(result).to.be.an.instanceOf(TileChange);
                expect(result.tilePositionId).to.equal("3-1");
                expect(result.tileId).to.equal(3);
            });
        });
        context("for the fourth time", function () {
            const result = solver.nextState() as TileChange;
            it("should return an instance of TileChange for position 4-1 with tile 4", function () {
                expect(result).to.be.an.instanceOf(TileChange);
                expect(result.tilePositionId).to.equal("4-1");
                expect(result.tileId).to.equal(4);
            });
        });
        context("for the fifth time", function () {
            const result = solver.nextState() as PuzzleChange;
            it("should return an instance of PuzzleChange", function () {
                expect(result).to.be.an.instanceof(PuzzleChange);
            });
            it("should have a type of Solved", function () {
                expect(result).to.equal(PuzzleChange.SOLVED);
            });
        });

    });

});


describe("BruteForceSolver behaviour", function () {

    describe("if #nextState() is called", function () {

        const components = getPuzzleComponents(VALID_TEST_PUZZLE);
        const solver = new BruteForceSolver(components.tetrahedron, components.tilePool);

        context("for the first time on an instance instantiated for the test puzzle", function () {
            const result = solver.nextState() as TileChange;
            it("should return a Place TileChange for position 1-1 with tile 1", function () {
                expect(result).to.be.an.instanceOf(TileChange);
                expect(result.type).to.equal("Place");
                expect(result.tilePositionId).to.equal("1-1");
                expect(result.tileId).to.equal(1);
            });
        });
        context("for the second time on an instance instantiated for the test puzzle", function () {
            const result = solver.nextState() as TileChange;
            it("should return a Place TileChange for position 2-1 with tile 2", function () {
                expect(result).to.be.an.instanceOf(TileChange);
                expect(result.type).to.equal("Place");
                expect(result.tilePositionId).to.equal("2-1");
                expect(result.tileId).to.equal(2);
            });
        });
        context("for the third time on an instance instantiated for the test puzzle", function () {
            const result = solver.nextState() as TileChange;
            it("should return a Place TileChange for position 3-1 with tile 3", function () {
                expect(result).to.be.an.instanceOf(TileChange);
                expect(result.type).to.equal("Place");
                expect(result.tilePositionId).to.equal("3-1");
                expect(result.tileId).to.equal(3);
            });
        });
        context("for the fourth time on an instance instantiated for the test puzzle", function () {
            const result = solver.nextState() as TilePositionChange;
            it("should return a Rotate TilePositionChange for position 3-1", function () {
                expect(result).to.be.an.instanceOf(TilePositionChange);
                expect(result.type).to.equal("Rotate");
                expect(result.tilePositionId).to.equal("3-1");
            });
        });
        context("for the fifth time on an instance instantiated for the test puzzle", function () {
            const result = solver.nextState() as TilePositionChange;
            it("should return a Rotate TilePositionChange for position 3-1", function () {
                expect(result).to.be.an.instanceOf(TilePositionChange);
                expect(result.type).to.equal("Rotate");
                expect(result.tilePositionId).to.equal("3-1");
            });
        });
        context("for the sixth time on an instance instantiated for the test puzzle", function () {
            const result = solver.nextState() as TileChange;
            it("should return a Remove TileChange for position 3-1 with tile 3", function () {
                expect(result).to.be.an.instanceOf(TileChange);
                expect(result.type).to.equal("Remove");
                expect(result.tilePositionId).to.equal("3-1");
                expect(result.tileId).to.equal(3);
            });
        });

    });

});
