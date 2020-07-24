import { getPuzzleComponents } from "../../src/js/puzzle-loader";
import { BruteForceSolver } from "../../src/js/solver-brute-force";
import {PuzzleChangeType, TileChange, TilePositionChange} from "../../src/js/puzzle-changes";
import { expect } from "chai";
import 'mocha';
// @ts-ignore
import {VALID_TEST_PUZZLE} from "./common-test-data";


describe("BruteForceSolver behaviour", function () {

    describe("if #nextState() is called", function () {

        const components = getPuzzleComponents(VALID_TEST_PUZZLE);
        const solver = new BruteForceSolver(components.tetrahedron, components.tilePool);

        context("for the first time on an instance instantiated for the test puzzle", function () {
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
        context("for the second time on an instance instantiated for the test puzzle", function () {
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
        context("for the third time on an instance instantiated for the test puzzle", function () {
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
        context("for the fourth time on an instance instantiated for the test puzzle", function () {
            const result = solver.nextState() as TilePositionChange;
            it("should return an instance of TileChange", function () {
                expect(result).to.be.an.instanceOf(TilePositionChange);
            });
            it("should be for type Rotate", function () {
                expect(result.type).to.equal(PuzzleChangeType.Rotate);
            });
            it("should be for position 3-1", function () {
                expect(result.tilePositionId).to.equal("3-1");
            });
        });
        context("for the fifth time on an instance instantiated for the test puzzle", function () {
            const result = solver.nextState() as TilePositionChange;
            it("should return an instance of TileChange", function () {
                expect(result).to.be.an.instanceOf(TilePositionChange);
            });
            it("should be for type Rotate", function () {
                expect(result.type).to.equal(PuzzleChangeType.Rotate);
            });
            it("should be for position 3-1", function () {
                expect(result.tilePositionId).to.equal("3-1");
            });
        });
        context("for the sixth time on an instance instantiated for the test puzzle", function () {
            const result = solver.nextState() as TileChange;
            it("should return an instance of TileChange", function () {
                expect(result).to.be.an.instanceOf(TileChange);
            });
            it("should be for type Remove", function () {
                expect(result.type).to.equal(PuzzleChangeType.Remove);
            });
            it("should be for position 3-1", function () {
                expect(result.tilePositionId).to.equal("3-1");
            });
            it("should be with tile 3", function () {
                expect(result.tileId).to.equal(3);
            });
        });

    });

});
