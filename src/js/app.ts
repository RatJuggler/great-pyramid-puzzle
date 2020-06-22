import * as pocketdata from "../pocket-puzzle-data.json";
import * as greatdata from "../great-puzzle-data.json";
import { Tetrahedron } from "./tetrahedron";

console.log("Initialising...");

let pocket = new Tetrahedron(pocketdata.puzzle, pocketdata.numberOfTilesPerFace, pocketdata.faces);
console.log(pocket.toString());

console.log("-------------------------")

let great = new Tetrahedron(greatdata.puzzle, greatdata.numberOfTilesPerFace, greatdata.faces);
console.log(great.toString());
