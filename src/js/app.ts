import * as config from "../pocket-puzzle-data.json";
import { Tetrahedron } from "./tetrahedron";

console.log("Initialising...");

let puzzle = new Tetrahedron(config);

console.log(puzzle.toString());
