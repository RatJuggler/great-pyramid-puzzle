import { expect } from 'chai';
import 'mocha';
import {PuzzleChange, PuzzleChangeSet} from "../../src/js/puzzle-changes";


describe("PuzzleChange behaviour", function () {

    describe("if #fromString() is called", function () {

        context("with an unsupported change type argument", function () {
            it("should throw an error", function () {
                expect(function () {
                    PuzzleChange.fromString("Error");
                }).to.throw(Error, "Base PuzzleChange only for Initial, Solved or Completed changes!");
            });
        });

        context("with Initial as an argument", function () {
            const result = PuzzleChange.fromString("Initial");
            it("should return the Initial PuzzleChange", function () {
                expect(result).to.equal(PuzzleChange.INITIAL);
            });
        });

        context("with Completed as an argument", function () {
            const result = PuzzleChange.fromString("Completed");
            it("should return the Completed PuzzleChange", function () {
                expect(result).to.equal(PuzzleChange.COMPLETED);
            });
        });

    });

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
                expect(PuzzleChange.COMPLETED.isCompleted()).to.be.true;
            });
        });

        context("on any other instance of PuzzleChange", function () {
            it("should return false", function () {
                expect(PuzzleChange.INITIAL.isCompleted()).to.be.false;
            });
        });

    });

});
