import {testPuzzle} from "./test-puzzle";
import {pocketPuzzle} from "./pocket-puzzle";
import {greatPuzzle} from "./great-puzzle";


let testButton = document.getElementById("test")!;
testButton.addEventListener("click", () => {
    testPuzzle();
});
let pocketButton = document.getElementById("pocket")!;
pocketButton.addEventListener("click", () => {
    pocketPuzzle();
});
let greatButton = document.getElementById("great")!;
greatButton.addEventListener("click", () => {
    greatPuzzle();
});
