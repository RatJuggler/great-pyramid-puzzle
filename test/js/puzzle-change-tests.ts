import { PuzzleChange, PuzzleChangeSet } from "../../src/js/puzzle-changes";
import { expect } from 'chai';
import 'mocha';


describe("PuzzleChange behaviour", function () {

    describe("if #isSolved() is called", function () {

        context("on the Solved instance of PuzzleChange", function () {
            it("should return true", function () {
                const change = PuzzleChangeSet.solved(new Array<PuzzleChange>());
                expect(change.isSolved()).to.be.true;
            });
        });

        context("on any other instance of PuzzleChange", function () {
            it("should return false", function () {
                expect(PuzzleChange.INITIAL.isSolved()).to.be.false;
            });
        });

    });

    describe("if #isCompleted() is called", function () {

        context("on the Completed instance of PuzzleChange", function () {
            it("should return true", function () {
                const change = PuzzleChangeSet.completed(new Array<PuzzleChange>());
                expect(change.isCompleted()).to.be.true;
            });
        });

        context("on any other instance of PuzzleChange", function () {
            it("should return false", function () {
                expect(PuzzleChange.INITIAL.isCompleted()).to.be.false;
            });
        });

    });

});
