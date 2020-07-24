import { getPuzzleComponents } from "../../src/js/puzzle-loader";
import { NoMatchingSolver } from "../../src/js/solver-no-matching";
import { Tile } from "../../src/js/tile";
import { PuzzleChange, TileChange } from "../../src/js/puzzle-changes";
import { expect } from "chai";
import 'mocha';
// @ts-ignore
import {VALID_TEST_PUZZLE} from "./common-test-data";


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
