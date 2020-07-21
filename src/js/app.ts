import { createSolverPromise } from "./app-options";
import { getPuzzleComponents } from "./puzzle-loader";
import { PuzzleComponents } from "./common-data-schema";
import { getDisplayManager } from "./display-loader";
import { DisplayManager } from "./display";
import { display } from "./display-change";
import { createTilePositionChange, createTileChange } from "./tile-position-change";
import { Solver, NoMatchingSolver, BruteForceSolver } from "./solver";


// Track animated display event timer.
let animatedDisplayId: number;


function getSelector(name: string): string {
    const selection  = <NodeListOf<HTMLInputElement>>document.querySelectorAll(`input[name = "${name}"]`)!;
    for (const rb of selection) {
        if (rb.checked) {
            return rb.value;
        }
    }
    throw new Error("Expected radio option to be selected!");
}

function attachRotateEvents(puzzle: PuzzleComponents, displayManager: DisplayManager): void {
    document.querySelectorAll("g")
        .forEach(function (svgGroup) {
            const tpId = svgGroup.id.match(/^([1-4])-([1-9])$/);
            if (tpId) {
                svgGroup.addEventListener("click", () => {
                    const tilePosition = puzzle.tetrahedron.getFace(tpId[1]).getTilePosition(tpId[2]);
                    if (!tilePosition.isEmpty()) {
                        tilePosition.rotateTile();
                        display(displayManager, createTilePositionChange("Rotate", tilePosition));
                    }
                });
            }
        });
}

function animateSolve(puzzle: PuzzleComponents, solver: Solver, displayManager: DisplayManager): void {
    // Schedule a series of events to place tiles on the puzzle.
    animatedDisplayId = setTimeout( () => {
        const tilePositionChange = solver.nextState();
        if (tilePositionChange) {
            display(displayManager, tilePositionChange);
            animateSolve(puzzle, solver, displayManager);
        } else {
            attachRotateEvents(puzzle, displayManager);
        }
    }, 1000);
}

function completeSolve(puzzle: PuzzleComponents, solver: Solver, displayManager: DisplayManager): void {
    // Set the overlay to prevent further UI interaction.
    toggleActive("overlay");
    // Start the solving process.
    const solving = createSolverPromise(solver);
    solving.promise.then((resolvedValue) => {
        // Show the final puzzle state and attach the rotate events.
        puzzle.tetrahedron.tilePositions
            .map((tilePosition) => createTileChange("Final", tilePosition))
            .forEach((displayChange) => display(displayManager, displayChange));
        attachRotateEvents(puzzle, displayManager);
        // Remove the overlay.
        toggleActive("overlay");
        return resolvedValue;
    }).catch((err) => {
        toggleActive("overlay");
        return err;
    });
    // Attach cancel trigger to required element.
    document.getElementById("overlay")!.addEventListener("click", () => solving.cancel());
}

function getSolveAlgorithm(puzzle: PuzzleComponents): Solver {
    const mainOption = getSelector("puzzle-option");
    switch (mainOption) {
        case "Test":
            return new NoMatchingSolver(puzzle.tetrahedron, puzzle.tilePool,
                getSelector("tile-selection"), getSelector("tile-placement"), getSelector("tile-rotation"));
        case "Solve":
            const solveAlgorithm = getSelector("solve-algorithm");
            switch (solveAlgorithm) {
                case "Brute":
                    return new BruteForceSolver(puzzle.tetrahedron, puzzle.tilePool);
                default:
                    throw new Error("Invalid solve algorithm option!");
            }
        default:
            throw new Error("Invalid puzzle option!");
    }
}

function solvePuzzle(): void {
    // Clear any previous display animations.
    if (animatedDisplayId) {
        clearInterval(animatedDisplayId);
    }
    // Determine the type of puzzle.
    const puzzleType = getSelector("puzzle-type");
    // Determine the data required for the puzzle and build the internal puzzle
    // representation with the pool of tiles waiting to be placed on it.
    const puzzle = getPuzzleComponents(puzzleType);
    // Find where we want the puzzle displayed.
    const displayElement = <HTMLElement>document.getElementById("puzzle-display-area")!;
    // Build a display manager.
    const displayManager = getDisplayManager(displayElement, puzzleType)
    // Show the initial puzzle state.
    displayManager.initialDisplay();
    // Build the solver to use.
    const solver = getSolveAlgorithm(puzzle);
    // Solve the puzzle depending on the display.
    const display = getSelector("puzzle-display");
    switch (display) {
        case "Completed":
            completeSolve(puzzle, solver, displayManager);
            break;
        case "Animated":
            animateSolve(puzzle, solver, displayManager);
            break;
        default:
            throw new Error("Invalid solve display option!");
    }
}

function toggleActive(...ids: Array<string>): void {
    ids.forEach((id) => document.getElementById(id)!.classList.toggle("active"));
}

function toggleOptions(): void {
    toggleActive("solve-puzzle", "test-puzzle");
}

document.getElementById("option-test")!.addEventListener("click", toggleOptions);
document.getElementById("option-solve")!.addEventListener("click", toggleOptions);

document.getElementById("menu-toggle")!.addEventListener('click', () => {
    toggleActive("layout", "menu", "menu-toggle")
});

function updateStatusInfo(innerText: string) {
    document.getElementById("show-info")!.innerText = innerText;
}

function addStatusInfoEvent(id: string, statusInfo: string) {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener("mouseenter", () => {
            updateStatusInfo(statusInfo);
        });
    }
}

addStatusInfoEvent("puzzle-type", "Select the difficulty of puzzle to work with.");
addStatusInfoEvent("puzzle-option", "Select to try the various test display options, without solving the puzzle, or to try and solve the puzzle.");
addStatusInfoEvent("puzzle-display", "Display the completed puzzle as soon as possible or show an animation of the completion process.");
addStatusInfoEvent("solve-algorithm", "Select which algorithm to use when solving the puzzle. NOTE: DOES NOT CURRENTLY SOLVE THE PUZZLE!");
addStatusInfoEvent("tile-selection", "How tiles are selected for the test display, randomly, in order or to use a fixed tile pattern.");
addStatusInfoEvent("tile-placement", "How tiles are placed on the test display, randomly or in order.");
addStatusInfoEvent("tile-rotation", "If tiles are randomly rotated before being placed on the test display.");
addStatusInfoEvent("go", "Proceed with the selected options.");

document.getElementById("menu")!.addEventListener("mouseleave", () => {
    updateStatusInfo("");
});

document.getElementById("go")!.addEventListener("click", solvePuzzle);
