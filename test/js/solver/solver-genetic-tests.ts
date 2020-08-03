import { getPuzzleComponents } from "../../../src/js/puzzle-loader";
import { PuzzleChange, PuzzleChangeType} from "../../../src/js/puzzle-changes";
import { GeneticSolver } from "../../../src/js/solver/solver-genetic";
import { expect } from "chai";
import 'mocha';
// @ts-ignore
import { VALID_TEST_PUZZLE } from "../common-test-data";


describe("GeneticSolver behaviour", function () {

    describe("if #nextState() is called", function () {

        const components = getPuzzleComponents(VALID_TEST_PUZZLE);
        const solver = new GeneticSolver(components.tetrahedron, components.tilePool);

        context("for the first time on an instance instantiated for the test puzzle", function () {
            const result = solver.nextState() as PuzzleChange;
            it("should return an instance of PuzzleChange", function () {
                expect(result).to.be.an.instanceOf(PuzzleChange);
            });
            it("should be for type Solved", function () {
                expect(result.type).to.equal(PuzzleChangeType.Solved);
            });
        });

        context("for the second time on an instance instantiated for the test puzzle", function () {
            const result = solver.nextState() as PuzzleChange;
            it("should return an instance of PuzzleChange", function () {
                expect(result).to.be.an.instanceOf(PuzzleChange);
            });
            it("should be for type Solved", function () {
                expect(result.type).to.equal(PuzzleChangeType.Solved);
            });
        });

    });


    describe("if #forceNextState() is called", function () {

        const components = getPuzzleComponents(VALID_TEST_PUZZLE);
        const solver = new GeneticSolver(components.tetrahedron, components.tilePool);

        context("on an instance instantiated for the test puzzle", function () {
            const result = solver.forceNextState() as PuzzleChange;
            it("should return an instance of PuzzleChange", function () {
                expect(result).to.be.an.instanceOf(PuzzleChange);
            });
            it("should be for type Completed", function () {
                expect(result.type).to.equal(PuzzleChangeType.Completed);
            });
        });

    });

});
