import * as testdata from "../test-puzzle-data.json";
import * as pocketdata from "../pocket-puzzle-data.json";
import * as greatdata from "../great-puzzle-data.json";
import { Tetrahedron } from "./tetrahedron";
import { TilePool } from "./tile-pool";
import {assert} from "chai";

function placeAllTiles(tilePool: TilePool, tetrahedron: Tetrahedron): void {
    let tile = tilePool.randomTile;
    while (tile) {
        assert.isTrue(tetrahedron.placeTileWithoutMatching(tile));
        tile = tilePool.randomTile;
    }
}

console.log("Initialising...");

let testTetrahedron = new Tetrahedron(testdata.puzzle, testdata.numberOfTilesPerFace, testdata.faces);
let testTiles = new TilePool(testdata.totalNumberOfTiles, testdata.tiles);
placeAllTiles(testTiles, testTetrahedron);
console.log(testTetrahedron.toString());

console.log("-------------------------")

let pocketTetrahedron = new Tetrahedron(pocketdata.puzzle, pocketdata.numberOfTilesPerFace, pocketdata.faces);
let pocketTiles = new TilePool(pocketdata.totalNumberOfTiles, pocketdata.tiles);
placeAllTiles(pocketTiles, pocketTetrahedron);
console.log(pocketTetrahedron.toString());

console.log("-------------------------")

let greatTetrahedron = new Tetrahedron(greatdata.puzzle, greatdata.numberOfTilesPerFace, greatdata.faces);
let greatTiles = new TilePool(greatdata.totalNumberOfTiles, greatdata.tiles);
placeAllTiles(greatTiles, greatTetrahedron);
console.log(greatTetrahedron.toString());
