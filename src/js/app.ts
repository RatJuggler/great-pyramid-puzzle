import { testPuzzle } from "./test-puzzle";
import { pocketPuzzle } from "./pocket-puzzle";
import { greatPuzzle } from "./great-puzzle";
import { PuzzleData } from "./puzzle-data-schema";
import { TileDisplayData } from "./puzzle-display-schema";
import { getTetrahedron, getTilePool } from "./puzzle-loader";
import { displayPuzzle } from "./puzzle-display";
import { Tetrahedron } from "./tetrahedron";


let displayInterval: number;

function doDisplay(tetrahedron: Tetrahedron, displayData: TileDisplayData) {
    displayPuzzle("#puzzle-display", tetrahedron, displayData);
    const tileId = RegExp('[1-4]-[1-9]');
    document.getElementById("puzzle-display")!.querySelectorAll("g")
        .forEach(function (svgGroup) {
            if (tileId.test(svgGroup.id)) {
                svgGroup.addEventListener("click", (e) => {
                    // @ts-ignore
                    const id = e.currentTarget!.id;
                    const tile = tetrahedron.getFace(id.charAt(0)).getTileAtPosition(id.charAt(2));
                    if (tile) {
                        tile.nextOrientation();
                        doDisplay(tetrahedron, displayData);
                    }
                });
            }
        });
}

function doPuzzle(puzzle: { puzzleData: PuzzleData; displayData: TileDisplayData; }) {
    if (displayInterval) {
        clearInterval(displayInterval);
    }
    const tetrahedron = getTetrahedron(puzzle.puzzleData);
    const tilePool = getTilePool(puzzle.puzzleData);
    doDisplay(tetrahedron, puzzle.displayData);
    displayInterval = setInterval( () => {
        let tile = (<HTMLInputElement>document.getElementById("tile-selection")!).checked ?
            tilePool.randomTile : tilePool.nextTile;
        if (tile) {
            console.assert((<HTMLInputElement>document.getElementById("tile-placement")!).checked ?
                tetrahedron.placeTileRandomly(tile) : tetrahedron.placeTileSequentially(tile));
            doDisplay(tetrahedron, puzzle.displayData);
        } else {
            clearInterval(displayInterval);
            displayInterval = 0;
        }
    }, 500);
}

function enablePuzzleButton(buttonId: string, puzzle: { puzzleData: PuzzleData; displayData: TileDisplayData; }) {
    document.getElementById(buttonId)!.addEventListener("click", () => doPuzzle(puzzle));
}

enablePuzzleButton("test", testPuzzle);
enablePuzzleButton("pocket", pocketPuzzle);
enablePuzzleButton("great", greatPuzzle);
