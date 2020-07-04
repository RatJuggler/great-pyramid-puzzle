import { testPuzzle } from "./test-puzzle";
import { pocketPuzzle } from "./pocket-puzzle";
import { greatPuzzle } from "./great-puzzle";
import { PuzzleData } from "./puzzle-data-schema";
import { DisplayData } from "./puzzle-display-schema";
import { getTetrahedron, getTilePool } from "./puzzle-loader";
import { DisplayManager } from "./puzzle-display";
import { Tetrahedron } from "./tetrahedron";


let placeTileInterval: number;
let displayManager: DisplayManager;

function attachRotateEvents(tetrahedron: Tetrahedron, puzzleDisplay: HTMLElement) {
    puzzleDisplay.querySelectorAll("g")
        .forEach(function (svgGroup) {
            const tpId = svgGroup.id.match(/^([1-4])-([1-9])$/);
            if (tpId) {
                svgGroup.addEventListener("click", (e) => {
                    // @ts-ignore
                    const tileSvg = <HTMLElement>e.currentTarget!;
                    const tile = tetrahedron.getFace(tpId[1]).getTileAtPosition(tpId[2]);
                    if (tile) {
                        tile.nextOrientation();
                        displayManager.rotateTile(tileSvg);
                    }
                });
            }
        });
}

function doPuzzle(puzzle: { puzzleData: PuzzleData; displayData: DisplayData; }) {
    // Clear any previous puzzle tile placement schedules.
    if (placeTileInterval) {
        clearInterval(placeTileInterval);
    }
    // Locate key UI elements.
    const selection = <HTMLInputElement>document.getElementById("tile-selection")!;
    const placement = <HTMLInputElement>document.getElementById("tile-placement")!;
    const puzzleDisplay = <HTMLInputElement>document.getElementById("puzzle-display")!;
    // Build internal puzzle representation with tiles waiting to be placed on it.
    const tetrahedron = getTetrahedron(puzzle.puzzleData);
    const tilePool = getTilePool(puzzle.puzzleData);
    // Show the initial puzzle state.
    displayManager = new DisplayManager(puzzleDisplay, puzzle.displayData);
    displayManager.displayPuzzle(tetrahedron);
    // Schedule a series of events to place tiles on the puzzle.
    placeTileInterval = setInterval( () => {
        const tile = selection.checked ? tilePool.randomTile : tilePool.nextTile;
        if (tile) {
            const tilePlacedPosition =
                placement.checked ? tetrahedron.placeTileRandomly(tile) : tetrahedron.placeTileSequentially(tile);
            console.assert(!!tilePlacedPosition);
            displayManager.redrawTilePosition(tilePlacedPosition!, puzzleDisplay);
        } else {
            clearInterval(placeTileInterval);
            placeTileInterval = 0;
            attachRotateEvents(tetrahedron, puzzleDisplay);
        }
    }, 500);
}

function enablePuzzleButton(buttonId: string, puzzle: { puzzleData: PuzzleData; displayData: DisplayData; }) {
    document.getElementById(buttonId)!.addEventListener("click", () => doPuzzle(puzzle));
}

enablePuzzleButton("test", testPuzzle);
enablePuzzleButton("pocket", pocketPuzzle);
enablePuzzleButton("great", greatPuzzle);
