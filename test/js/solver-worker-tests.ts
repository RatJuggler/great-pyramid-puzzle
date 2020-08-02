import { solverWorker } from "../../src/js/solver-worker";
import { WorkerParameters } from "../../src/js/common-data-schema";
import { expect } from "chai";
import 'mocha';


describe("SolverWorker behaviour", function () {

    describe("if #solverWorker() is called", function () {

        context("with an invalid MessageEvent", function () {
            const parameters: WorkerParameters = {
                continue: false,
                solverOptions: {
                    puzzleType: "Simple",
                    solveAlgorithm: "Error",
                    tileSelection: "Random",
                    tilePlacement: "Random",
                    tileRotation: "None"
                }
            }
            it("should throw an error", function () {
                expect(function () {
                    solverWorker(parameters);
                }).to.throw(Error, "Invalid solve algorithm option!");
            });
        });

        context("with a valid MessageEvent", function () {
            const parameters: WorkerParameters = {
                continue: false,
                solverOptions: {
                    puzzleType: "Simple",
                    solveAlgorithm: "NoMatching",
                    tileSelection: "Random",
                    tilePlacement: "Random",
                    tileRotation: "None"
                }
            }
            const result = solverWorker(parameters);
            it("should return a WorkerResult solvedOrCompleted property of Solved", function () {
                expect(result).to.have.property("solvedOrCompleted");
                expect(result.solvedOrCompleted).to.equal("Solved");
            });
            it("should return a WorkerResult changeCounter property of 4", function () {
                expect(result).to.have.property("changeCounter");
                expect(result.changeCounter).to.equal(4);
            });
            it("should return a WorkerResult finalState property of Solved", function () {
                expect(result).to.have.property("finalState");
            });
        });

    });

});
