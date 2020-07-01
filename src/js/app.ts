import { PuzzleData } from "./puzzle-data-schema";
import { TileDisplayData } from "./puzzle-display-schema";
import { getTetrahedron, getTilePool } from "./puzzle-loader";
import { displayPuzzle } from "./puzzle-display";
import { TilePool } from "./tile-pool";
import { Tetrahedron } from "./tetrahedron";


let tetrahedron: Tetrahedron;
let tilePool: TilePool;
let displayInterval: number;


function doPuzzle(puzzle: { puzzleData: PuzzleData; displayData: TileDisplayData; }) {
    tetrahedron = getTetrahedron(puzzle.puzzleData);
    tilePool = getTilePool(puzzle.puzzleData);
    if (displayInterval) {
        clearInterval(displayInterval);
    }
    displayPuzzle("#puzzle-display", tetrahedron, puzzle.displayData);
    displayInterval = setInterval(function () {
        let tile = tilePool.randomTile;
        if (tile) {
            console.assert(tetrahedron.placeTileRandomly(tile));
            displayPuzzle("#puzzle-display", tetrahedron, puzzle.displayData);
        }
    }, 1000);
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
