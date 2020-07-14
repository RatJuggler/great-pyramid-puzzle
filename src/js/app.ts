import { getSelector, getPuzzleTypeData, getTileSelection, placeTile, createSolverPromise } from "./app-options";
import { PuzzleComponents } from "./common-data-schema";
import { getPuzzleComponents } from "./puzzle-loader";
import { Tetrahedron } from "./tetrahedron";
import { TilePool } from "./tile-pool";


// Track tile placing event timer.
let placeTileInterval: number;


function attachRotateEvents(puzzle: PuzzleComponents): void {
    puzzle.displayElement.querySelectorAll("g")
        .forEach(function (svgGroup) {
            const tpId = svgGroup.id.match(/^([1-4])-([1-9])$/);
            if (tpId) {
                svgGroup.addEventListener("click", (e) => {
                    // @ts-ignore
                    const tileSvg = <HTMLElement>e.currentTarget!;
                    const tilePosition = puzzle.tetrahedron.getFace(tpId[1]).getTilePosition(tpId[2]);
                    if (!tilePosition.isEmpty()) {
                        tilePosition.rotateTile();
                        puzzle.displayManager.rotateTile(tileSvg);
                    }
                });
            }
        });
}

function animateTest(puzzle: PuzzleComponents): void {
    // Schedule a series of events to place tiles on the puzzle.
    placeTileInterval = setInterval( () => {
        const tile = getTileSelection(puzzle.tilePool);
        if (tile) {
            const tilePlacedPosition = placeTile(tile, puzzle.tetrahedron);
            puzzle.displayManager.redrawTilePosition(tilePlacedPosition, puzzle.displayElement);
        } else {
            clearInterval(placeTileInterval);
            placeTileInterval = 0;
            attachRotateEvents(puzzle);
        }
    }, 1000);
}

function completeTest(puzzle: PuzzleComponents): void {
    // Place the tiles using the options selected, without matching this will be very fast.
    let tile = getTileSelection(puzzle.tilePool);
    while (tile) {
        placeTile(tile, puzzle.tetrahedron);
        tile = getTileSelection(puzzle.tilePool);
    }
    puzzle.displayManager.displayPuzzle(puzzle.tetrahedron);
    attachRotateEvents(puzzle);
}

function testDisplay(): void {
    // Clear any previous puzzle tile placement schedules.
    if (placeTileInterval) {
        clearInterval(placeTileInterval);
    }
    // Determine the data required for the puzzle.
    const puzzleTypeData = getPuzzleTypeData();
    // Find where we want the puzzle displayed.
    const displayElement = <HTMLElement>document.getElementById("puzzle-display")!;
    // Build internal puzzle representation, pool of tiles waiting to be placed on it and a display manager to show it.
    const puzzle = getPuzzleComponents(puzzleTypeData, displayElement);
    // Show the initial puzzle state.
    puzzle.displayManager.displayPuzzle(puzzle.tetrahedron);
    // Complete the test depending on the display.
    const display = getSelector("test-display");
    switch (display) {
        case "Completed":
            completeTest(puzzle);
            break;
        case "Animated":
            animateTest(puzzle);
            break;
        default:
            throw new Error("Invalid test display option!");
    }
}

function animatePuzzle(puzzle: PuzzleComponents): void {
    // Schedule a series of events to place tiles on the puzzle.
    placeTileInterval = setInterval( () => {
        const tile = puzzle.tilePool.nextTile;
        if (tile) {
            const tilePlacedPosition = puzzle.tetrahedron.placeTileSequentially(tile);
            puzzle.displayManager.redrawTilePosition(tilePlacedPosition!, puzzle.displayElement);
        } else {
            clearInterval(placeTileInterval);
            placeTileInterval = 0;
            attachRotateEvents(puzzle);
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

function completePuzzle(puzzle: PuzzleComponents): void {
    // Set the overlay to prevent further UI interaction.
    showElement("overlay");
    // Start the solving process.
    const solver = createSolverPromise(doPuzzleSolver, puzzle.tetrahedron, puzzle.tilePool);
    solver.promise.then((resolvedValue) => {
        // Show the final puzzle state and attach the rotate events.
        puzzle.displayManager.displayPuzzle(puzzle.tetrahedron);
        attachRotateEvents(puzzle);
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
    // Determine the data required for the puzzle.
    const puzzleTypeData = getPuzzleTypeData();
    // Find where we want the puzzle displayed.
    const displayElement = <HTMLElement>document.getElementById("puzzle-display")!;
    // Build internal puzzle representation, pool of tiles waiting to be placed on it and a display manager to show it.
    const puzzle = getPuzzleComponents(puzzleTypeData, displayElement);
    // Show the initial puzzle state.
    puzzle.displayManager.displayPuzzle(puzzle.tetrahedron);
    // Solve the puzzle depending on the display.
    const display = getSelector("solve-display");
    switch (display) {
        case "Completed":
            completePuzzle(puzzle);
            break;
        case "Animated":
            animatePuzzle(puzzle);
            break;
        default:
            throw new Error("Invalid solve display option!");
    }
}

function mainOptions(): void {
    const mainOption = getSelector("puzzle-option");
    switch (mainOption) {
        case "Test":
            testDisplay();
            break;
        case "Solve":
            solvePuzzle();
            break;
        default:
            throw new Error("Invalid puzzle option!");
    }
}

function swapOptions(): void {
    const mainOption = getSelector("puzzle-option");
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
            throw new Error("Invalid puzzle option!");
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

function addStatusInfoEvent(id: string, statusInfo: string) {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener("mouseenter", () => {
            document.getElementById("show-info")!.innerText = statusInfo;
        });
    }
}

addStatusInfoEvent("puzzle-type", "Select the difficulty of puzzle to work with.");
addStatusInfoEvent("puzzle-option", "Select to try the various test display options or to try and solve the puzzle.");
addStatusInfoEvent("solve-display", "Display the solved puzzle as soon as possible or show an animation of the solving process.");
addStatusInfoEvent("solve-algorithm", "Select which algorithm to use when solving the puzzle. NOTE: DOES NOT CURRENTLY SOLVE THE PUZZLE!");
addStatusInfoEvent("test-display", "Display the test layout immediately or show an animation of the layout process.");
addStatusInfoEvent("tile-selection", "How tiles are selected for the test display, randomly, in order or to use a fixed tile pattern.");
addStatusInfoEvent("tile-placement", "How tiles are placed on the test display, randomly or in order.");
addStatusInfoEvent("tile-rotation", "If tiles are randomly rotated before being placed on the test display.");
addStatusInfoEvent("go", "Proceed with the selected options.");

document.getElementById("puzzle-options")!.addEventListener("mouseleave", () => {
    document.getElementById("show-info")!.innerText = "";
});

document.getElementById("go")!.addEventListener("click", () => mainOptions());
