import { PuzzleData } from "./puzzle-data-schema";
import { Tetrahedron } from "./tetrahedron";
import { TilePool } from "./tile-pool";


function loadPuzzleAndPlaceTiles(puzzleType: PuzzleData): Tetrahedron {
    const tetrahedron = new Tetrahedron(puzzleType.puzzle, puzzleType.numberOfTilesPerFace, puzzleType.faces);
    const tiles = new TilePool(puzzleType.totalNumberOfTiles, puzzleType.tiles);
    let tile = tiles.randomTile;
    while (tile) {
        console.assert(tetrahedron.placeTileWithoutMatching(tile));
        tile = tiles.randomTile;
    }
    return tetrahedron;
}

function dumpPuzzle(puzzle: Tetrahedron) {
    console.log(puzzle.toString());
    console.log("-".repeat(80) + '\n');
}

export { loadPuzzleAndPlaceTiles, dumpPuzzle }
