import { getSelector, getPuzzleType, getTileSelection, placeTile, createSolverPromise } from "./app-options";
import { DisplayManager } from "./puzzle-display";
import { getTetrahedron, getTilePool } from "./puzzle-loader";
import { Tetrahedron } from "./tetrahedron";
import { TilePool } from "./tile-pool";


// Track tile placing event timer.
let placeTileInterval: number;


function attachRotateEvents(puzzleDisplay: HTMLElement, tetrahedron: Tetrahedron, displayManager: DisplayManager): void {
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

function animateTest(tilePool: TilePool, tetrahedron: Tetrahedron, displayManager: DisplayManager, puzzleDisplay: HTMLElement): void {
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

function completeTest(tilePool: TilePool, tetrahedron: Tetrahedron, displayManager: DisplayManager, puzzleDisplay: HTMLElement): void {
    // Place the tiles using the options selected, without matching this will be very fast.
    let tile = getTileSelection(tilePool);
    while (tile) {
        placeTile(tile, tetrahedron);
        tile = getTileSelection(tilePool);
    }
    displayManager.displayPuzzle(tetrahedron);
    attachRotateEvents(puzzleDisplay, tetrahedron, displayManager);
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
    // Complete the test depending on the display.
    const display = getSelector("test-display");
    switch (display) {
        case "Completed":
            completeTest(tilePool, tetrahedron, displayManager, puzzleDisplay);
            break;
        case "Animated":
            animateTest(tilePool, tetrahedron, displayManager, puzzleDisplay);
            break;
        default:
            throw new Error("Invalid test display option!");
    }
}

function animatePuzzle(tilePool: TilePool, tetrahedron: Tetrahedron, displayManager: DisplayManager, puzzleDisplay: HTMLElement): void {
    // Schedule a series of events to place tiles on the puzzle.
    placeTileInterval = setInterval( () => {
        const tile = tilePool.nextTile;
        if (tile) {
            const tilePlacedPosition = tetrahedron.placeTileSequentially(tile);
            displayManager.redrawTilePosition(tilePlacedPosition!, puzzleDisplay);
        } else {
            clearInterval(placeTileInterval);
            placeTileInterval = 0;
            attachRotateEvents(puzzleDisplay, tetrahedron, displayManager);
        }
    }, 1000);
}

function doPuzzleSolver(id: number, resolve: () => void, tetrahedron: Tetrahedron, tilePool: TilePool): void {
    const tile = tilePool.nextTile;
    if (tile) {
        tetrahedron.placeTileSequentially(tile);
    } else {
        clearInterval(id);
        resolve();
    }
}

function completePuzzle(tilePool: TilePool, tetrahedron: Tetrahedron, displayManager: DisplayManager, puzzleDisplay: HTMLElement): void {
    // Set the overlay to prevent further UI interaction.
    showElement("overlay");
    // Start the solving process.
    const solver = createSolverPromise(doPuzzleSolver, tetrahedron, tilePool);
    solver.promise.then((resolvedValue) => {
        // Show the final puzzle state and attach the rotate events.
        displayManager.displayPuzzle(tetrahedron);
        attachRotateEvents(puzzleDisplay, tetrahedron, displayManager);
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

function solvePuzzle(): void {
    // Determine the puzzle type.
    const puzzle = getPuzzleType();
    // Build internal puzzle representation with tiles waiting to be placed on it.
    const tetrahedron = getTetrahedron(puzzle.layoutData);
    const tilePool = getTilePool(puzzle.tileData);
    // Show the initial puzzle state.
    const puzzleDisplay = <HTMLInputElement>document.getElementById("puzzle-display")!;
    const displayManager = new DisplayManager(puzzleDisplay, puzzle.displayData);
    displayManager.displayPuzzle(tetrahedron);
    // Solve the puzzle depending on the display.
    const display = getSelector("solve-display");
    switch (display) {
        case "Completed":
            completePuzzle(tilePool, tetrahedron, displayManager, puzzleDisplay);
            break;
        case "Animated":
            animatePuzzle(tilePool, tetrahedron, displayManager, puzzleDisplay);
            break;
        default:
            throw new Error("Invalid solve display option!");
    }
}

function mainOptions(): void {
    const mainOption = getSelector("option");
    switch (mainOption) {
        case "Test":
            testDisplay();
            break;
        case "Solve":
            solvePuzzle();
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
