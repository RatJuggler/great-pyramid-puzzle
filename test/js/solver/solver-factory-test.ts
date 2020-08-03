import { buildSolver } from "../../../src/js/solver/solver-factory";
import { NoMatchingSolver } from "../../../src/js/solver/solver-no-matching";
import { BruteForceSolver } from "../../../src/js/solver/solver-brute-force";
import { OnlyValidSolver } from "../../../src/js/solver/solver-only-valid";
import { GeneticSolver } from "../../../src/js/solver/solver-genetic";
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

    context("with a valid set of arguments for the No Matching algorithm", function () {
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

    context("with a valid set of arguments for the Brute Force algorithm", function () {
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

    context("with a valid set of arguments for the Only Valid algorithm", function () {
        const solverOptions = {
            puzzleType: "Simple",
            solveAlgorithm: "OnlyValid",
            tileSelection: "",
            tilePlacement: "",
            tileRotation: ""
        }
        it("should return an instance of OnlyValidSolver", function () {
            const result = buildSolver(solverOptions);
            expect(result).to.an.instanceof(OnlyValidSolver);
        });
    });

    context("with a valid set of arguments for the Genetic algorithm", function () {
        const solverOptions = {
            puzzleType: "Simple",
            solveAlgorithm: "Genetic",
            tileSelection: "",
            tilePlacement: "",
            tileRotation: ""
        }
        it("should return an instance of GeneticSolver", function () {
            const result = buildSolver(solverOptions);
            expect(result).to.an.instanceof(GeneticSolver);
        });
    });

});
