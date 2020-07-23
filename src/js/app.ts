import { createSolverPromise } from "./app-options";
import { getPuzzleComponents } from "./puzzle-loader";
import { PuzzleComponents } from "./common-data-schema";
import { getDisplayManager } from "./display-loader";
import { DisplayManager } from "./display-manager";
import { TilePositionChange } from "./tile-position-change";
import { Solver, NoMatchingSolver, BruteForceSolver } from "./solver";


// Track solver ticks.
let solverIntervalId: number;


function getSelector(name: string): string {
    const selection  = document.querySelectorAll(`input[name = "${name}"]`) as NodeListOf<HTMLInputElement>;
    for (const rb of selection) {
        if (rb.checked) {
            return rb.value;
        }
    }
    throw new Error("Expected radio option to be selected!");
}

function attachRotateEvents(displayManager: DisplayManager): void {
    document.querySelectorAll("g")
        .forEach(function (svgGroup) {
            const tpId = svgGroup.id.match(/^[1-4]-[1-9]$/);
            if (tpId) {
                svgGroup.addEventListener("click", () =>
                    displayManager.display(new TilePositionChange("Rotate", tpId[0]))
                );
            }
        });
}

function animateSolve(solver: Solver, displayManager: DisplayManager, animateDuration: number): void {
    // Schedule a series of events to place tiles on the puzzle.
    solverIntervalId = setInterval( () => {
        const tilePositionChange = solver.nextState();
        if (tilePositionChange) {
            displayManager.display(tilePositionChange);
        } else {
            clearInterval(solverIntervalId)
            attachRotateEvents(displayManager);
        }
    }, animateDuration + 50);
}

function completeSolve(solver: Solver, displayManager: DisplayManager): void {
    // Set the overlay to prevent further UI interaction.
    toggleActive("overlay");
    // Start the solving process.
    const solving = createSolverPromise(solver);
    solving.promise.then((finalState) => {
        // Show the final puzzle state and attach the rotate events.
        (finalState as Array<TilePositionChange>).forEach((tpChange) => displayManager.display(tpChange));
        attachRotateEvents(displayManager);
        // Remove the overlay.
        toggleActive("overlay");
        return finalState;
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
    // Clear any previous solvers.
    if (solverIntervalId) {
        clearInterval(solverIntervalId);
    }
    // Determine the type of puzzle.
    const puzzleType = getSelector("puzzle-type");
    // Determine the data required for the puzzle and build the internal puzzle
    // representation with the pool of tiles waiting to be placed on it.
    const puzzle = getPuzzleComponents(puzzleType);
    // Build the solver to use.
    const solver = getSolveAlgorithm(puzzle);
    // Find where we want the puzzle displayed.
    const displayElement = <HTMLElement>document.getElementById("puzzle-display-area")!;
    // Build a display manager.
    const displayManager = getDisplayManager(displayElement, puzzleType);
    // Show the initial puzzle state.
    displayManager.initialDisplay();
    // Solve the puzzle depending on the display.
    const display = getSelector("display-option");
    switch (display) {
        case "Completed":
            completeSolve(solver, displayManager);
            break;
        case "Animated":
            const animateDuration = parseInt(getSelector("animation-speed"));
            displayManager.animationDuration = animateDuration;
            animateSolve(solver, displayManager, animateDuration);
            break;
        default:
            throw new Error("Invalid solve display option!");
    }
}

function toggleActive(...ids: Array<string>): void {
    ids.forEach((id) => document.getElementById(id)!.classList.toggle("active"));
}

function togglePuzzleOptions(): void {
    toggleActive("solve-puzzle", "test-puzzle");
}

function toggleAnimationOptions(): void {
    toggleActive("animation-options");
}

document.getElementById("option-solve")!.addEventListener("click", togglePuzzleOptions);
document.getElementById("option-test")!.addEventListener("click", togglePuzzleOptions);

document.getElementById("display-animated")!.addEventListener("click", toggleAnimationOptions);
document.getElementById("display-completed")!.addEventListener("click", toggleAnimationOptions);

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

addStatusInfoEvent("go", "Proceed with the selected options.");
addStatusInfoEvent("puzzle-type", "Select the difficulty of puzzle to work with.");
addStatusInfoEvent("puzzle-option", "Select to try and solve the puzzle or to test the various display options without solving it.");
addStatusInfoEvent("solve-algorithm", "Select which algorithm to use when solving the puzzle.");
addStatusInfoEvent("tile-selection", "How tiles are selected for the test display, randomly, in order or to use a fixed tile pattern.");
addStatusInfoEvent("tile-placement", "How tiles are placed on the test display, randomly or in order.");
addStatusInfoEvent("tile-rotation", "If tiles are randomly rotated before being placed on the test display.");
addStatusInfoEvent("puzzle-display", "Show an animation of the puzzle being completed or just display the finished solution.");
addStatusInfoEvent("animation-speed", "How fast you want the animation to run.");

document.getElementById("menu")!.addEventListener("mouseleave", () => {
    updateStatusInfo("");
});

document.getElementById("go")!.addEventListener("click", solvePuzzle);
