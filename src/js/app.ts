import { PuzzleData } from "./puzzle-data-schema";
import { TileDisplayData } from "./puzzle-display-schema";
import { getTetrahedron, getTilePool } from "./puzzle-loader";
import { displayPuzzle } from "./puzzle-display";
import { TilePool } from "./tile-pool";
import { Tetrahedron } from "./tetrahedron";


let tetrahedron: Tetrahedron;
let tilePool: TilePool;
let displayData: TileDisplayData;
let displayInterval: number;

function doDisplay() {
    displayPuzzle("#puzzle-display", tetrahedron, displayData);
    const tileId = RegExp('[1-4]-[1-9]');
    document.getElementById("puzzle-display")!.querySelectorAll("g")
        .forEach(function (svgGroup) {
            if (tileId.test(svgGroup.id)) {
                svgGroup.addEventListener("click", function () {
                    const tile = tetrahedron.getFace(this.id.charAt(0)).getTileAtPosition(this.id.charAt(2));
                    if (tile) {
                        tile.nextOrientation();
                        doDisplay();
                    }
                });
            }
        });
}

function doPuzzle(puzzle: { puzzleData: PuzzleData; displayData: TileDisplayData; }) {
    tetrahedron = getTetrahedron(puzzle.puzzleData);
    tilePool = getTilePool(puzzle.puzzleData);
    displayData = puzzle.displayData;
    if (displayInterval) {
        clearInterval(displayInterval);
    }
    doDisplay();
    displayInterval = setInterval(function () {
        let tile = (<HTMLInputElement>document.getElementById("tile-selection")!).checked ?
            tilePool.randomTile : tilePool.nextTile;
        if (tile) {
            console.assert((<HTMLInputElement>document.getElementById("tile-placement")!).checked ?
                tetrahedron.placeTileRandomly(tile) : tetrahedron.placeTileSequentially(tile));
            doDisplay();
        } else {
            clearInterval(displayInterval);
            displayInterval = 0;
        }
    }, 500);
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
