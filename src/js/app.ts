import testdata from "../test-puzzle-data.json";
import pocketdata from "../pocket-puzzle-data.json";
import greatdata from "../great-puzzle-data.json";
import { PuzzleData } from "./puzzle-data-schema";
import { Tetrahedron } from "./tetrahedron";
import { TilePool } from "./tile-pool";
import { SVG } from "@svgdotjs/svg.js";


function loadPuzzleAndPlaceTiles(puzzleType: PuzzleData): void {
    const tetrahedron = new Tetrahedron(puzzleType.puzzle, puzzleType.numberOfTilesPerFace, puzzleType.faces);
    const tiles = new TilePool(puzzleType.totalNumberOfTiles, puzzleType.tiles);
    let tile = tiles.randomTile;
    while (tile) {
        console.assert(tetrahedron.placeTileWithoutMatching(tile));
        tile = tiles.randomTile;
    }
    console.log(tetrahedron.toString());
}


const canvas = SVG().addTo("body").size("100%", "100%");
const path = canvas.path("M 73.9224 -42.6791L -73.9224 -42.6791L 0 85.3583L 73.9224 -42.6791 Z");

path.fill('none').stroke({width: 2, color: '#000'}).move(10,10).scale(0.5);
path.animate(5000).rotate(365).loop();


loadPuzzleAndPlaceTiles(testdata);

console.log("-".repeat(80)+'\n');

loadPuzzleAndPlaceTiles(pocketdata);

console.log("-".repeat(80)+'\n');

loadPuzzleAndPlaceTiles(greatdata);
