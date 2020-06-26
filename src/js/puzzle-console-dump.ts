import testdata from "../test-puzzle-data.json";
import pocketdata from "../pocket-puzzle-data.json";
import greatdata from "../great-puzzle-data.json";
import { PuzzleData } from "./puzzle-data-schema";
import { Tetrahedron } from "./tetrahedron";
import { TilePool } from "./tile-pool";


function loadPuzzleAndPlaceTiles(puzzleType: PuzzleData): void {
    const tetrahedron = new Tetrahedron(puzzleType.puzzle, puzzleType.numberOfTilesPerFace, puzzleType.faces);
    const tiles = new TilePool(puzzleType.totalNumberOfTiles, puzzleType.tiles);
    let tile = tiles.randomTile;
    while (tile) {
        console.assert(tetrahedron.placeTileWithoutMatching(tile));
        tile = tiles.randomTile;
    }
    console.log(tetrahedron.toString());
    console.log("-".repeat(80) + '\n');
}

function dumpPuzzles() {
    loadPuzzleAndPlaceTiles(testdata);
    loadPuzzleAndPlaceTiles(pocketdata);
    loadPuzzleAndPlaceTiles(greatdata);
}

export { dumpPuzzles }
