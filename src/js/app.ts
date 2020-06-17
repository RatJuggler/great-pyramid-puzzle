import { Tetrahedron } from "./tetrahedron";
import { Tile } from "./tile";

console.log("Initialising...");

let puzzle = new Tetrahedron("Pocket", 4);

let tile = new Tile("XYZ");

puzzle.addTile(tile);

puzzle.display();
