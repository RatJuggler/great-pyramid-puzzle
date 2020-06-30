import { PuzzleData } from "./puzzle-data-schema";
import { TileDisplayData } from "./puzzle-display-schema";
import { getTetrahedron, getTilePool } from "./puzzle-loader";
import { placeTilesRandomly } from "./place-tiles.js";
import { displayPuzzle } from "./puzzle-display";


function doPuzzle(puzzle: { puzzleData: PuzzleData; displayData: TileDisplayData; }) {
    const tetrahedron = getTetrahedron(puzzle.puzzleData);
    const tilePool = getTilePool(puzzle.puzzleData);
    placeTilesRandomly(tetrahedron, tilePool);
    displayPuzzle("#puzzle-display", tetrahedron, puzzle.displayData);
}

let testButton = document.getElementById("test")!;
testButton.addEventListener("click", () => {
    import("./test-puzzle").then(function(puzzle) {
        doPuzzle(puzzle.testPuzzle);
    })
});
let pocketButton = document.getElementById("pocket")!;
pocketButton.addEventListener("click", () => {
    import("./pocket-puzzle").then(function(puzzle) {
        doPuzzle(puzzle.pocketPuzzle);
    })
});
let greatButton = document.getElementById("great")!;
greatButton.addEventListener("click", () => {
    import("./great-puzzle").then(function(puzzle) {
        doPuzzle(puzzle.greatPuzzle);
    })
});
