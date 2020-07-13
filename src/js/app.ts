import { testPuzzle } from "./test-puzzle";
import { pocketPuzzle } from "./pocket-puzzle";
import { greatPuzzle } from "./great-puzzle";
import { PuzzleDefinition } from "./common-data-schema";
import { DisplayManager } from "./puzzle-display";
import { getTetrahedron, getTilePool } from "./puzzle-loader";
import { Tetrahedron } from "./tetrahedron";
import { Tile } from "./tile";
import { TilePool } from "./tile-pool";
import { TilePosition } from "./tile-position";
import { getRandomInt } from "./utils";


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
                    const tilePosition = tetrahedron.getFace(tpId[1]).getTilePosition(tpId[2]);
                    if (!tilePosition.isEmpty()) {
                        tilePosition.nextOrientation();
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
    throw new Error("Expected radio option to be selected!");
}

function getPuzzleType(): PuzzleDefinition {
    const puzzleType = getSelector("puzzle-type");
    switch (puzzleType) {
        case "Test":
            return testPuzzle;
        case "Pocket":
            return pocketPuzzle;
        case "Great":
            return greatPuzzle;
        default:
            throw new Error("Invalid puzzle type option!");
    }
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

function orientateTile(tilePosition: TilePosition): TilePosition {
    const orientation = getSelector("tile-orientation");
    switch (orientation) {
        case "Default":
            return tilePosition;
        case "Random":
            for (let i = getRandomInt(3); i > 0; --i) {
                tilePosition.nextOrientation();
            }
            return tilePosition;
        default:
            throw new Error("Invalid tile orientation option!");
    }
}

function placeTile(tile: Tile, tetrahedron: Tetrahedron): TilePosition  {
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
    return orientateTile(tilePlacedPosition);
}

function doPuzzle(): void {
    // Clear any previous puzzle tile placement schedules.
    if (placeTileInterval) {
        clearInterval(placeTileInterval);
    }
    // Determine the puzzle type.
    const puzzle = getPuzzleType();
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

document.getElementById("go")!.addEventListener("click", () => doPuzzle());
