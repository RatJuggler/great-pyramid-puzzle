import { Solver } from "./solver-base";
import { NoMatchingSolver } from "./solver-no-matching";
import { BruteForceSolver } from "./solver-brute-force";
import { OnlyValidSolver } from "./solver-only-valid";
import { GeneticSolver } from "./solver-genetic";
import { getPuzzleComponents } from "../puzzle-loader";


interface SolverOptions {
    puzzleType: string,
    solveAlgorithm: string,
    tileSelection: string,
    tilePlacement: string,
    tileRotation: string
}

function buildSolver(options: SolverOptions): Solver {
    // Use the options from the UI to build a solver.
    switch (options.solveAlgorithm) {
        case "NoMatching":
            return new NoMatchingSolver(getPuzzleComponents(options.puzzleType),
                options.tileSelection, options.tilePlacement, options.tileRotation);
        case "Brute":
            return new BruteForceSolver(getPuzzleComponents(options.puzzleType));
        case "OnlyValid":
            return new OnlyValidSolver(getPuzzleComponents(options.puzzleType));
        case "Genetic":
            return new GeneticSolver(options.puzzleType);
        default:
            throw new Error("Invalid solve algorithm option!");
    }
}

export { SolverOptions, buildSolver }
