import { buildSolver } from "../../src/js/solver-factory";
import { NoMatchingSolver } from "../../src/js/solver-no-matching";
import { BruteForceSolver } from "../../src/js/solver-brute-force";
import { expect } from 'chai';
import 'mocha';


describe("if #buildSolver() is called", function () {

    context("with an invalid solver algorithm", function () {
        const solverOptions = {
            puzzleType: "Simple",
            solveAlgorithm: "error",
            tileSelection: "Random",
            tilePlacement: "Random",
            tileRotation: "Random"
        }
        it("should throw an error", function () {
            expect(function () {
                buildSolver(solverOptions);
            }).to.throw(Error, "Invalid solve algorithm option!");
        });
    });

    context("with a valid set of test options", function () {
        const solverOptions = {
            puzzleType: "Simple",
            solveAlgorithm: "NoMatching",
            tileSelection: "Random",
            tilePlacement: "Random",
            tileRotation: "Random"
        }
        it("should return an instance of the test solver NoMatchingSolver", function () {
            const result = buildSolver(solverOptions);
            expect(result).to.an.instanceof(NoMatchingSolver);
        });
    });

    context("with a valid set of puzzle options", function () {
        const solverOptions = {
            puzzleType: "Simple",
            solveAlgorithm: "Brute",
            tileSelection: "",
            tilePlacement: "",
            tileRotation: ""
        }
        it("should return an instance of BruteForceSolver", function () {
            const result = buildSolver(solverOptions);
            expect(result).to.an.instanceof(BruteForceSolver);
        });
    });

});
