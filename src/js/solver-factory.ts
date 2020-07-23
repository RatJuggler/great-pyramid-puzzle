import { getPuzzleComponents } from "./puzzle-loader";
import { BruteForceSolver, NoMatchingSolver, Solver } from "./solver";

function buildSolver(puzzleType: string, solveAlgorithm: string, tileSelection: string, tilePlacement: string, tileRotation: string): Solver {
    // Determine the data required for the puzzle and build the internal puzzle
    // representation with the pool of tiles waiting to be placed on it.
    const puzzle = getPuzzleComponents(puzzleType);
    // Use the UI options to build a solver with the puzzle data.
    switch (solveAlgorithm) {
        case "Test":
            return new NoMatchingSolver(puzzle.tetrahedron, puzzle.tilePool, tileSelection, tilePlacement, tileRotation);
        case "Brute":
            return new BruteForceSolver(puzzle.tetrahedron, puzzle.tilePool);
        default:
            throw new Error("Invalid solve algorithm option!");
    }
}

export { buildSolver }
