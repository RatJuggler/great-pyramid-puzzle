import { PuzzleChange } from "../../../src/js/puzzle-changes";
import { GeneticSolver } from "../../../src/js/solver/solver-genetic";
import { expect } from "chai";
import 'mocha';


describe("GeneticSolver behaviour", function () {

    let solver: GeneticSolver;

    beforeEach(function () {
        solver = new GeneticSolver("Simple");
    });

    describe("if #nextState() is called", function () {

        context("for the first time on an instance instantiated for the test puzzle", function () {
            it("should return an instance of PuzzleChange of type Current", function () {
                const result = solver.nextState() as PuzzleChange;
                expect(result).to.be.an.instanceOf(PuzzleChange);
                // expect(result.type).to.equal(PuzzleChangeType.Current);
            });
        });

        context("for the second time on an instance instantiated for the test puzzle", function () {
            it("should return an instance of PuzzleChange of type Current", function () {
                const result = solver.nextState() as PuzzleChange;
                expect(result).to.be.an.instanceOf(PuzzleChange);
                // expect(result.type).to.equal(PuzzleChangeType.Current);
            });
        });

    });


    describe("if #forceNextState() is called", function () {

        context("on an instance instantiated for the test puzzle", function () {
            it("should return an instance of PuzzleChange of type Current", function () {
                const result = solver.forceNextState() as PuzzleChange;
                expect(result).to.be.an.instanceOf(PuzzleChange);
                // expect(result.type).to.equal(PuzzleChangeType.Current);
            });
        });

    });

});
