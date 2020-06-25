import testdata from "../test-puzzle-data.json";
import pocketdata from "../pocket-puzzle-data.json";
import greatdata from "../great-puzzle-data.json";
import { PuzzleData } from "./puzzle-data-schema";
import { Tetrahedron } from "./tetrahedron";
import { TilePool } from "./tile-pool";
import { SVG, Matrix } from "@svgdotjs/svg.js";


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


const canvas = SVG().addTo("body").size("100%", "100%").viewbox("56.4094 53.8583 303.589 261.996");
const face1 = canvas.path('M  73.9224  -42.6791 L -73.9224  -42.6791 L    0        85.3583 L  73.9224  -42.6791 Z');
const face2 = canvas.path('M  73.9224  -46.947  L   0      -174.984  L  -73.9224  -46.947  L  73.9224  -46.947  Z');
const face3 = canvas.path('M 152.113    87.4922 L  78.1903  -40.5452 L    4.26791  87.4922 L 152.113    87.4922 Z');
const face4 = canvas.path('M  -4.26791  87.4922 L -78.1903  -40.5452 L -152.113    87.4922 L  -4.26791  87.4922 Z');
const tetrahedron = canvas.group();
tetrahedron.add(face1);
tetrahedron.add(face2);
tetrahedron.add(face3);
tetrahedron.add(face4);
const matrix = new Matrix(0.996264, 0, 0, 0.996264, 208.204, 228.439);
tetrahedron.transform(matrix);
tetrahedron.fill('none').stroke({width: 1, color: '#000'});


loadPuzzleAndPlaceTiles(testdata);

console.log("-".repeat(80)+'\n');

loadPuzzleAndPlaceTiles(pocketdata);

console.log("-".repeat(80)+'\n');

loadPuzzleAndPlaceTiles(greatdata);
