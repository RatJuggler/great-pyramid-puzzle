import { testPuzzle } from "./test-puzzle";
import { pocketPuzzle } from "./pocket-puzzle";
import { greatPuzzle } from "./great-puzzle";
import { PuzzleData } from "./puzzle-data-schema";
import { DisplayData } from "./puzzle-display-schema";
import { getTetrahedron, getTilePool } from "./puzzle-loader";
import { DisplayManager } from "./puzzle-display";
import { Tetrahedron } from "./tetrahedron";


let displayInterval: number;
let displayManager: DisplayManager;

function doDisplay(tetrahedron: Tetrahedron) {
    displayManager.displayPuzzle(tetrahedron);
    const tileId = RegExp('[1-4]-[1-9]');
    document.getElementById("puzzle-display")!.querySelectorAll("g")
        .forEach(function (svgGroup) {
            if (tileId.test(svgGroup.id)) {
                svgGroup.addEventListener("click", (e) => {
                    // @ts-ignore
                    const tileSvg = <HTMLElement>e.currentTarget!;
                    const tile = tetrahedron.getFace(tileSvg.id.charAt(0)).getTileAtPosition(tileSvg.id.charAt(2));
                    if (tile) {
                        tile.nextOrientation();
                        displayManager.rotateTile(tileSvg);
                    }
                });
            }
        });
}

function doPuzzle(puzzle: { puzzleData: PuzzleData; displayData: DisplayData; }) {
    if (displayInterval) {
        clearInterval(displayInterval);
    }
    const tetrahedron = getTetrahedron(puzzle.puzzleData);
    const tilePool = getTilePool(puzzle.puzzleData);
    displayManager = new DisplayManager("#puzzle-display", puzzle.displayData);
    doDisplay(tetrahedron);
    displayInterval = setInterval( () => {
        const selection = <HTMLInputElement>document.getElementById("tile-selection")!;
        const tile = selection.checked ? tilePool.randomTile : tilePool.nextTile;
        if (tile) {
            const placement = <HTMLInputElement>document.getElementById("tile-placement")!;
            const tilePlaced = placement.checked ? tetrahedron.placeTileRandomly(tile) : tetrahedron.placeTileSequentially(tile);
            console.assert(!!tilePlaced);
            doDisplay(tetrahedron);
        } else {
            clearInterval(displayInterval);
            displayInterval = 0;
        }
    }, 500);
}

function enablePuzzleButton(buttonId: string, puzzle: { puzzleData: PuzzleData; displayData: DisplayData; }) {
    document.getElementById(buttonId)!.addEventListener("click", () => doPuzzle(puzzle));
}

enablePuzzleButton("test", testPuzzle);
enablePuzzleButton("pocket", pocketPuzzle);
enablePuzzleButton("great", greatPuzzle);
