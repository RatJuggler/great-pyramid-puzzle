import { getSelector, getPuzzleType, getTileSelection, placeTile, createSolverPromise } from "./app-options";
import { DisplayManager } from "./puzzle-display";
import { getTetrahedron, getTilePool } from "./puzzle-loader";
import { Tetrahedron } from "./tetrahedron";
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
                    const tilePosition = tetrahedron.getFace(tpId[1]).getTilePosition(tpId[2]);
                    if (!tilePosition.isEmpty()) {
                        tilePosition.rotateTile();
                        displayManager.rotateTile(tileSvg);
                    }
                });
            }
        });
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

function solvePuzzle(id: number, resolve: () => void, tetrahedron: Tetrahedron, tilePool: TilePool): void {
    const tile = tilePool.nextTile;
    if (tile) {
        tetrahedron.placeTileSequentially(tile);
    } else {
        clearInterval(id);
        resolve();
    }
}

function completePuzzle(): void {
    // Set the overlay to prevent further UI interaction.
    showElement("overlay");
    // Determine the puzzle type.
    const puzzle = getPuzzleType();
    // Build internal puzzle representation with tiles waiting to be placed on it.
    const tetrahedron = getTetrahedron(puzzle.layoutData);
    const tilePool = getTilePool(puzzle.tileData);
    // Show the initial puzzle state.
    const puzzleDisplay = <HTMLInputElement>document.getElementById("puzzle-display")!;
    const displayManager = new DisplayManager(puzzleDisplay, puzzle.displayData);
    displayManager.displayPuzzle(tetrahedron);
    // Start the solving process.
    const solver = createSolverPromise(solvePuzzle, tetrahedron, tilePool);
    solver.promise.then((resolvedValue) => {
        // Show the final puzzle state.
        displayManager.displayPuzzle(tetrahedron);
        // Remove the overlay.
        hideElement("overlay");
        return resolvedValue;
    }).catch((err) => {
        hideElement("overlay");
        return err;
    });
    // Attach cancel trigger to required element.
    document.getElementById("overlay")!.addEventListener("click", () => solver.cancel());
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
    switch (mainOption) {
        case "Test":
            hideElement("solve-puzzle");
            showElement("test-puzzle");
            break;
        case "Solve":
            showElement("solve-puzzle");
            hideElement("test-puzzle");
            break;
        default:
            throw new Error("Invalid main option!");
    }
}

function showElement(id: string): void {
    document.getElementById(id)!.style.display = "block";
}

function hideElement(id: string): void {
    document.getElementById(id)!.style.display = "none";
}

swapOptions();
document.getElementById("option-test")!.addEventListener("click", () => swapOptions());
document.getElementById("option-solve")!.addEventListener("click", () => swapOptions());
document.getElementById("go")!.addEventListener("click", () => mainOptions());
