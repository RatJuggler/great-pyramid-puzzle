import testdata from "../test-puzzle-data.json";
import pocketdata from "../pocket-puzzle-data.json";
import greatdata from "../great-puzzle-data.json";
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

function loadTestPuzzleAndPlaceTiles(): Tetrahedron {
    return loadPuzzleAndPlaceTiles(testdata);
}

function loadPocketPuzzleAndPlaceTiles(): Tetrahedron {
    return loadPuzzleAndPlaceTiles(pocketdata);
}

function loadGreatPuzzleAndPlaceTiles(): Tetrahedron {
    return loadPuzzleAndPlaceTiles(greatdata);
}

export { dumpPuzzle, loadTestPuzzleAndPlaceTiles, loadPocketPuzzleAndPlaceTiles, loadGreatPuzzleAndPlaceTiles }
