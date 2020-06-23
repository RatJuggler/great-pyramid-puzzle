import * as testdata from "../test-puzzle-data.json";
import * as pocketdata from "../pocket-puzzle-data.json";
import * as greatdata from "../great-puzzle-data.json";
import { Tetrahedron } from "./tetrahedron";
import { TilePool } from "./tile-pool";

console.log("Initialising...");

let test = new Tetrahedron(testdata.puzzle, testdata.numberOfTilesPerFace, testdata.faces);
console.log(test.toString());
let testTiles = new TilePool(testdata.totalNumberOfTiles, testdata.tiles);
console.log(testTiles.toString());

console.log("-------------------------")

let pocket = new Tetrahedron(pocketdata.puzzle, pocketdata.numberOfTilesPerFace, pocketdata.faces);
console.log(pocket.toString());
let pocketTiles = new TilePool(pocketdata.totalNumberOfTiles, pocketdata.tiles);
console.log(pocketTiles.toString());

console.log("-------------------------")

let great = new Tetrahedron(greatdata.puzzle, greatdata.numberOfTilesPerFace, greatdata.faces);
console.log(great.toString());
let greatTiles = new TilePool(greatdata.totalNumberOfTiles, greatdata.tiles);
console.log(greatTiles.toString());
