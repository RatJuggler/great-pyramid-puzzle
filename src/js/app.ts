import {Face} from "./face";
import { Tetrahedron } from "./tetrahedron";

console.log("Initialising...");

let face = new Face("A");

face.display();

let puzzle = new Tetrahedron("Pocket");

puzzle.display();
