import { testPuzzle } from "./test-puzzle";
import { pocketPuzzle } from "./pocket-puzzle";
import { greatPuzzle } from "./great-puzzle";
import { LayoutData } from "./layout-data-schema";
import { TileData } from "./tile-data-schema";
import { DisplayData } from "./puzzle-display-schema";
import { DisplayManager } from "./puzzle-display";
import { getTetrahedron, getTilePool } from "./puzzle-loader";
import { Tetrahedron } from "./tetrahedron";
import { Tile } from "./tile";
import { TilePool } from "./tile-pool";


// Track tile placing event timer.
let placeTileInterval: number;


function attachRotateEvents(puzzleDisplay: HTMLElement, tetrahedron: Tetrahedron, displayManager: DisplayManager) {
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

function getSelector(name: string): string {
    const selection  = <NodeListOf<HTMLInputElement>>document.querySelectorAll(`input[name = "${name}"]`)!;
    for (const rb of selection) {
        if (rb.checked) {
            return rb.value;
        }
    }
    return "Random";
}

function getTileSelection(tilePool: TilePool): Tile | null {
    const selection = getSelector("tile-selection");
    switch (selection) {
        case "Random":
            return tilePool.randomTile;
        case "Sequential":
            return tilePool.nextTile;
        case "Test":
            return tilePool.testTile;
        default:
            throw new Error("Invalid tile selection option!");
    }
}

function placeTile(tile: Tile, tetrahedron: Tetrahedron)  {
    const placement = getSelector("tile-placement");
    let tilePlacedPosition;
    switch (placement) {
        case "Random":
            tilePlacedPosition = tetrahedron.placeTileRandomly(tile);
            break;
        case "Sequential":
            tilePlacedPosition = tetrahedron.placeTileSequentially(tile);
            break
        default:
            throw new Error("Invalid tile placement option!");
    }
    if (!tilePlacedPosition) {
        throw new Error("Failed to place tile on puzzle!");
    }
    return tilePlacedPosition;
}

function doPuzzle(puzzle: { layoutData: LayoutData; tileData: TileData; displayData: DisplayData; }): void {
    // Clear any previous puzzle tile placement schedules.
    if (placeTileInterval) {
        clearInterval(placeTileInterval);
    }
    // Build internal puzzle representation with tiles waiting to be placed on it.
    const tetrahedron = getTetrahedron(puzzle.layoutData);
    const tilePool = getTilePool(puzzle.tileData);
    // Show the initial puzzle state.
    const puzzleDisplay = <HTMLInputElement>document.getElementById("puzzle-display")!;
    const displayManager = new DisplayManager(puzzleDisplay, puzzle.displayData);
    displayManager.displayPuzzle(tetrahedron);
    // Schedule a series of events to place tiles on the puzzle.
    placeTileInterval = setInterval( () => {
        const tile = getTileSelection(tilePool);
        if (tile) {
            const tilePlacedPosition = placeTile(tile, tetrahedron);
            displayManager.redrawTilePosition(tilePlacedPosition, puzzleDisplay);
        } else {
            clearInterval(placeTileInterval);
            placeTileInterval = 0;
            attachRotateEvents(puzzleDisplay, tetrahedron, displayManager);
        }
    }, 1000);
}

function enablePuzzleButton(buttonId: string, puzzle: { layoutData: LayoutData; tileData: TileData; displayData: DisplayData; }) {
    document.getElementById(buttonId)!.addEventListener("click", () => doPuzzle(puzzle));
}

enablePuzzleButton("test", testPuzzle);
enablePuzzleButton("pocket", pocketPuzzle);
enablePuzzleButton("great", greatPuzzle);
