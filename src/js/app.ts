import 'regenerator-runtime/runtime'
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
                        tilePosition.rotateTile();
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

function rotateTile(tilePosition: TilePosition): TilePosition {
    const rotation = getSelector("tile-rotation");
    switch (rotation) {
        case "None":
            return tilePosition;
        case "Random":
            for (let i = getRandomInt(3); i > 0; --i) {
                tilePosition.rotateTile();
            }
            return tilePosition;
        default:
            throw new Error("Invalid tile rotation option!");
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
    return rotateTile(tilePlacedPosition);
}

function testDisplay(): void {
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

function completePuzzle(): void {
    // Define completion flag and cancel trigger.
    let finished = false;
    let cancel: () => void;
    // Create the promise to solve the puzzle.
    new Promise((resolve, reject) => {
        // Set the overlay to prevent further UI interaction then start the solving process.
        overlayOn();
        let solving = 0;
        const id = setInterval(() => {
            solving++;
            console.log("Solving: " + solving);
            if (solving === 5) {
                console.log("Solved!");
                clearInterval(id);
                resolve();
            }
        }, 1000);
        // Triggering the cancel.
        cancel = (): void => {
            // If already completed no need to cancel.
            if (finished) {
                return;
            }
            // Process the cancel.
            console.log("Cancelling...");
            clearInterval(id);
            reject();
        }
        // If cancelled before promise is started.
        if (finished) {
            cancel();
        }
    })
        // Always set 'finished', so further cancelling has no effect, and remove the overlay.
        // Note: Can't use finally here as we have targeted ES2016.
        .then((resolvedValue) => {
            finished = true;
            overlayOff();
            return resolvedValue;
        })
        .catch((err) => {
            finished = true;
            overlayOff();
            return err;
        });
    // Attach cancel trigger to required element.
    document.getElementById("overlay")!.addEventListener("click", () => cancel());
}

function startPuzzle() {
    alert("Display puzzle as solution progresses.");
}

function doPuzzle(): void {
    const display = getSelector("algorithm-display");
    switch (display) {
        case "Completed":
            completePuzzle();
            break;
        case "Progress":
            startPuzzle();
            break;
        default:
            throw new Error("Invalid algorithm display option!");
    }
}

function mainOptions(): void {
    const mainOption = getSelector("option");
    switch (mainOption) {
        case "Test":
            testDisplay();
            break;
        case "Solve":
            doPuzzle();
            break;
        default:
            throw new Error("Invalid main option!");
    }
}

function swapOptions(): void {
    const mainOption = getSelector("option");
    const solvePuzzle = <HTMLElement>document.getElementById("solve-puzzle")!;
    const testDisplay = <HTMLElement>document.getElementById("test-display")!;
    switch (mainOption) {
        case "Test":
            solvePuzzle.classList.add("hide-item");
            testDisplay.classList.remove("hide-item");
            break;
        case "Solve":
            solvePuzzle.classList.remove("hide-item");
            testDisplay.classList.add("hide-item");
            break;
        default:
            throw new Error("Invalid main option!");
    }
}

function overlayOn() {
    document.getElementById("overlay")!.style.display = "block";
}

function overlayOff() {
    document.getElementById("overlay")!.style.display = "none";
}

document.getElementById("option-test")!.addEventListener("click", () => swapOptions());
document.getElementById("option-solve")!.addEventListener("click", () => swapOptions());
document.getElementById("go")!.addEventListener("click", () => mainOptions());
