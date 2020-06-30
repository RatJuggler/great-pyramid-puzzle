import { PuzzleData } from "./puzzle-data-schema";
import { Tetrahedron } from "./tetrahedron";
import { TilePool } from "./tile-pool";


function getTetrahedron(puzzleType: PuzzleData): Tetrahedron {
    return new Tetrahedron(puzzleType.puzzle, puzzleType.numberOfTilesPerFace, puzzleType.faces);
}

function getTilePool(puzzleType: PuzzleData): TilePool {
    return new TilePool(puzzleType.totalNumberOfTiles, puzzleType.tiles);
}

function dumpPuzzle(puzzle: Tetrahedron) {
    console.log(puzzle.toString());
    console.log("-".repeat(80) + '\n');
}

export { getTetrahedron, getTilePool, dumpPuzzle }
