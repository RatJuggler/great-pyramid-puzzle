import { getPuzzleComponents } from "./puzzle-loader";
import { Solver } from "./solver-base";
import { NoMatchingSolver } from "./solver-no-matching";
import { BruteForceSolver } from "./solver-brute-force";
import { OnlyValidSolver } from "./solver-only-valid";
import { GeneticSolver } from "./solver-genetic";


interface SolverOptions {
    puzzleType: string,
    solveAlgorithm: string,
    tileSelection: string,
    tilePlacement: string,
    tileRotation: string
}

function buildSolver(options: SolverOptions): Solver {
    // Determine the data required for the puzzle and build the internal puzzle
    // representation with the pool of tiles waiting to be placed on it.
    const puzzle = getPuzzleComponents(options.puzzleType);
    // Use the options from the UI to build a solver with the puzzle data.
    switch (options.solveAlgorithm) {
        case "NoMatching":
            return new NoMatchingSolver(puzzle.tetrahedron, puzzle.tilePool,
                options.tileSelection, options.tilePlacement, options.tileRotation);
        case "Brute":
            return new BruteForceSolver(puzzle.tetrahedron, puzzle.tilePool);
        case "OnlyValid":
            return new OnlyValidSolver(puzzle.tetrahedron, puzzle.tilePool);
        case "Genetic":
            return new GeneticSolver(puzzle.tetrahedron, puzzle.tilePool);
        default:
            throw new Error("Invalid solve algorithm option!");
    }
}

export { SolverOptions, buildSolver }
