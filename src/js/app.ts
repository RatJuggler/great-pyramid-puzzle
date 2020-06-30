import {testPuzzle} from "./test-puzzle";
import {pocketPuzzle} from "./pocket-puzzle";
import {greatPuzzle} from "./great-puzzle";
import {displayPuzzle} from "./puzzle-display";
import {loadPuzzleAndPlaceTiles} from "./puzzle-loader";


function doPuzzle(puzzle: { puzzleData: any; displayData: any; }) {
    displayPuzzle(loadPuzzleAndPlaceTiles(puzzle.puzzleData), puzzle.displayData);
}

let testButton = document.getElementById("test")!;
testButton.addEventListener("click", () => {
    doPuzzle(testPuzzle);
});
let pocketButton = document.getElementById("pocket")!;
pocketButton.addEventListener("click", () => {
    doPuzzle(pocketPuzzle);
});
let greatButton = document.getElementById("great")!;
greatButton.addEventListener("click", () => {
    doPuzzle(greatPuzzle);
});
