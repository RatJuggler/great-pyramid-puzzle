import * as testdata from "../test-puzzle-data.json";
import * as pocketdata from "../pocket-puzzle-data.json";
import * as greatdata from "../great-puzzle-data.json";
import { PuzzleData } from "./puzzle-data-schema";
import { Tetrahedron } from "./tetrahedron";
import { TilePool } from "./tile-pool";


function placeAllTiles(tilePool: TilePool, tetrahedron: Tetrahedron): void {
    let tile = tilePool.randomTile;
    while (tile) {
        console.assert(tetrahedron.placeTileWithoutMatching(tile));
        tile = tilePool.randomTile;
    }
}

function loadPuzzleAndPlaceTiles(puzzleType: PuzzleData): void {
    let tetrahedron = new Tetrahedron(puzzleType.puzzle, puzzleType.numberOfTilesPerFace, puzzleType.faces);
    let tiles = new TilePool(puzzleType.totalNumberOfTiles, puzzleType.tiles);
    placeAllTiles(tiles, tetrahedron);
    console.log(tetrahedron.toString());
}


loadPuzzleAndPlaceTiles(testdata);

console.log("-".repeat(80)+'\n');

loadPuzzleAndPlaceTiles(pocketdata);

console.log("-".repeat(80)+'\n');

loadPuzzleAndPlaceTiles(greatdata);
