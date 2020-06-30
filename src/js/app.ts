import { PuzzleData } from "./puzzle-data-schema";
import { TileDisplayData } from "./puzzle-display-schema";
import { displayPuzzle } from "./puzzle-display";
import { loadPuzzleAndPlaceTiles } from "./puzzle-loader";


function doPuzzle(puzzle: { puzzleData: PuzzleData; displayData: TileDisplayData; }) {
    displayPuzzle("#puzzle-display", loadPuzzleAndPlaceTiles(puzzle.puzzleData), puzzle.displayData);
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
