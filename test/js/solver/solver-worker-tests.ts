import { solverWorker } from "../../../src/js/solver/solver-worker";
import { WorkerParameters } from "../../../src/js/common-data-schema";
import { expect } from "chai";
import 'mocha';


describe("SolverWorker behaviour", function () {

    describe("if #solverWorker() is called", function () {

        context("with an invalid WorkerParameters", function () {
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

        context("with a valid WorkerParameters", function () {
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
            it("should return a WorkerResult stepCounter property of 4", function () {
                expect(result).to.have.property("stepCounter");
                expect(result.stepCounter).to.equal(4);
            });
            it("should return a WorkerResult finalState property", function () {
                expect(result).to.have.property("finalState");
            });
            it("should return an Array in finalState", function () {
                expect(result.finalState).to.be.instanceof(Array);
            });
            it("should return a Array length of 4", function () {
                expect(result.finalState.length).to.equal(4);
            });
        });

    });

});
