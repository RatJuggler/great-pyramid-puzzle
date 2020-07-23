import { getPuzzleComponents } from "./puzzle-loader";
import { BruteForceSolver, NoMatchingSolver, Solver } from "./solver";


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
        case "Test":
            return new NoMatchingSolver(puzzle.tetrahedron, puzzle.tilePool,
                options.tileSelection, options.tilePlacement, options.tileRotation);
        case "Brute":
            return new BruteForceSolver(puzzle.tetrahedron, puzzle.tilePool);
        default:
            throw new Error("Invalid solve algorithm option!");
    }
}

export { SolverOptions, buildSolver }
