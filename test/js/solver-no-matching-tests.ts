import { getPuzzleComponents } from "../../src/js/puzzle-loader";
import { NoMatchingSolver } from "../../src/js/solver-no-matching";
import { PuzzleChange, PuzzleChangeType, TileChange } from "../../src/js/puzzle-changes";
import { expect } from "chai";
import 'mocha';
// @ts-ignore
import {VALID_TEST_PUZZLE} from "./common-test-data";


describe("NoMatchingSolver behaviour", function () {

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

        context("with an invalid tile selection", function () {
            const components = getPuzzleComponents(VALID_TEST_PUZZLE);
            const solver = new NoMatchingSolver(components.tetrahedron, components.tilePool,
                "error", "Random", "None");
            it("should throw an error", function () {
                expect(function () {
                    solver.nextState();
                }).to.throw(Error, "Invalid tile selection option!");
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

    describe("if #nextState() is called on a properly instantiated instance using Sequential options", function () {

        const components = getPuzzleComponents(VALID_TEST_PUZZLE);
        const solver = new NoMatchingSolver(components.tetrahedron, components.tilePool,
            "Sequential", "Sequential", "None");

        context("for the first time", function () {
            const result = solver.nextState() as TileChange;
            it("should return an instance of TileChange", function () {
                expect(result).to.be.an.instanceOf(TileChange);
            });
            it("should be for type Place", function () {
                expect(result.type).to.equal(PuzzleChangeType.Place);
            });
            it("should be for position 1-1", function () {
                expect(result.tilePositionId).to.equal("1-1");
            });
            it("should be with tile 1", function () {
                expect(result.tileId).to.equal(1);
            });
        });
        context("for the second time", function () {
            const result = solver.nextState() as TileChange;
            it("should return an instance of TileChange", function () {
                expect(result).to.be.an.instanceOf(TileChange);
            });
            it("should be for type Place", function () {
                expect(result.type).to.equal(PuzzleChangeType.Place);
            });
            it("should be for position 2-1", function () {
                expect(result.tilePositionId).to.equal("2-1");
            });
            it("should be with tile 2", function () {
                expect(result.tileId).to.equal(2);
            });
        });
        context("for the third time", function () {
            const result = solver.nextState() as TileChange;
            it("should return an instance of TileChange", function () {
                expect(result).to.be.an.instanceOf(TileChange);
            });
            it("should be for type Place", function () {
                expect(result.type).to.equal(PuzzleChangeType.Place);
            });
            it("should be for position 3-1", function () {
                expect(result.tilePositionId).to.equal("3-1");
            });
            it("should be with tile 3", function () {
                expect(result.tileId).to.equal(3);
            });
        });
        context("for the fourth time", function () {
            const result = solver.nextState() as TileChange;
            it("should return an instance of TileChange", function () {
                expect(result).to.be.an.instanceOf(TileChange);
            });
            it("should be for type Place", function () {
                expect(result.type).to.equal(PuzzleChangeType.Place);
            });
            it("should be for position 4-1", function () {
                expect(result.tilePositionId).to.equal("4-1");
            });
            it("should be with tile 4", function () {
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

    describe("if #nextState() is called on a properly instantiated instance using Random options", function () {

        const components = getPuzzleComponents(VALID_TEST_PUZZLE);
        const solver = new NoMatchingSolver(components.tetrahedron, components.tilePool,
            "Random", "Random", "None");

        context("for the first time", function () {
            const result = solver.nextState() as TileChange;
            it("should return an instance of TileChange", function () {
                expect(result).to.be.an.instanceOf(TileChange);
            });
            it("should be for type Place", function () {
                expect(result.type).to.equal(PuzzleChangeType.Place);
            });
            it("should be for a random position", function () {
                expect("1-1,2-1,3-1,4-1").to.include(result.tilePositionId);
            });
            it("should be with a random tile", function () {
                expect([1,2,3,4]).to.include(result.tileId);
            });
        });
        context("for the second time", function () {
            const result = solver.nextState() as TileChange;
            it("should return an instance of TileChange", function () {
                expect(result).to.be.an.instanceOf(TileChange);
            });
            it("should be for type Place", function () {
                expect(result.type).to.equal(PuzzleChangeType.Place);
            });
            it("should be for a random position", function () {
                expect("1-1,2-1,3-1,4-1").to.include(result.tilePositionId);
            });
            it("should be with a random tile", function () {
                expect([1,2,3,4]).to.include(result.tileId);
            });
        });
        context("for the third time", function () {
            const result = solver.nextState() as TileChange;
            it("should return an instance of TileChange", function () {
                expect(result).to.be.an.instanceOf(TileChange);
            });
            it("should be for type Place", function () {
                expect(result.type).to.equal(PuzzleChangeType.Place);
            });
            it("should be for a random position", function () {
                expect("1-1,2-1,3-1,4-1").to.include(result.tilePositionId);
            });
            it("should be with a random tile", function () {
                expect([1,2,3,4]).to.include(result.tileId);
            });
        });
        context("for the fourth time", function () {
            const result = solver.nextState() as TileChange;
            it("should return an instance of TileChange", function () {
                expect(result).to.be.an.instanceOf(TileChange);
            });
            it("should be for type Place", function () {
                expect(result.type).to.equal(PuzzleChangeType.Place);
            });
            it("should be for a random position", function () {
                expect("1-1,2-1,3-1,4-1").to.include(result.tilePositionId);
            });
            it("should be with a random tile", function () {
                expect([1,2,3,4]).to.include(result.tileId);
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

    describe("if #nextState() is called on a properly instantiated instance using the Display Test tile selection option",
        function () {

        const components = getPuzzleComponents(VALID_TEST_PUZZLE);
        const solver = new NoMatchingSolver(components.tetrahedron, components.tilePool,
            "DisplayTest", "Sequential", "None");

        context("for the first time", function () {
            const result = solver.nextState() as TileChange;
            it("should return an instance of TileChange", function () {
                expect(result).to.be.an.instanceOf(TileChange);
            });
            it("should be for type Place", function () {
                expect(result.type).to.equal(PuzzleChangeType.Place);
            });
            it("should be for position 1-1", function () {
                expect(result.tilePositionId).to.equal("1-1");
            });
            it("should be with tile 0", function () {
                expect(result.tileId).to.equal(0);
            });
        });
        context("for the second time", function () {
            const result = solver.nextState() as TileChange;
            it("should return an instance of TileChange", function () {
                expect(result).to.be.an.instanceOf(TileChange);
            });
            it("should be for type Place", function () {
                expect(result.type).to.equal(PuzzleChangeType.Place);
            });
            it("should be for position 3-1", function () {
                expect(result.tilePositionId).to.equal("2-1");
            });
            it("should be with tile 0", function () {
                expect(result.tileId).to.equal(0);
            });
        });
        context("for the third time", function () {
            const result = solver.nextState() as TileChange;
            it("should return an instance of TileChange", function () {
                expect(result).to.be.an.instanceOf(TileChange);
            });
            it("should be for type Place", function () {
                expect(result.type).to.equal(PuzzleChangeType.Place);
            });
            it("should be for position 3-1", function () {
                expect(result.tilePositionId).to.equal("3-1");
            });
            it("should be with tile 0", function () {
                expect(result.tileId).to.equal(0);
            });
        });
        context("for the fourth time", function () {
            const result = solver.nextState() as TileChange;
            it("should return an instance of TileChange", function () {
                expect(result).to.be.an.instanceOf(TileChange);
            });
            it("should be for type Place", function () {
                expect(result.type).to.equal(PuzzleChangeType.Place);
            });
            it("should be for position 4-1", function () {
                expect(result.tilePositionId).to.equal("4-1");
            });
            it("should be with tile 0", function () {
                expect(result.tileId).to.equal(0);
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
