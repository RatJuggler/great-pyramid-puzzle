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

function startSolver(solver: Solver, displayManager: DisplayManager, animateDuration: number): void {
    if (animateDuration === 0) {
        // Set the overlay to prevent further UI interaction.
        addActive("overlay");
        // Attach cancel trigger to the overlay.
        document.getElementById("overlay")!.addEventListener("click", () => {
            clearInterval(solverIntervalId);
            removeActive("overlay");
        });
    }
    runSolver(solver, displayManager, animateDuration);
}

function runSolver(solver: Solver, displayManager: DisplayManager, animateDuration: number): void {
    // Schedule a series of events to place tiles on the puzzle.
    solverIntervalId = setTimeout( () => {
        const tilePositionChange = solver.nextState();
        if (tilePositionChange) {
            if (animateDuration > 0) {
                displayManager.display(tilePositionChange);
            }
            runSolver(solver, displayManager, animateDuration);
        } else {
            clearInterval(solverIntervalId)
            if (animateDuration === 0) {
                removeActive("overlay");
                // Show the final puzzle state.
                solver.finalState().forEach((tpChange) => displayManager.display(tpChange));
            }
            attachRotateEvents(displayManager);
        }
    }, animateDuration + 20);
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

function getSpeed(): number {
    const display = getSelector("display-option");
    switch (display) {
        case "Completed":
            return 0;
        case "Animated":
            return parseInt(getSelector("animation-speed"));
        default:
            throw new Error("Invalid solve display option!");
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
    // Decide on the speed.
    const animationDuration = getSpeed();
    // Find where we want the puzzle displayed.
    const displayElement = <HTMLElement>document.getElementById("puzzle-display-area")!;
    // Build a display manager.
    const displayManager = getDisplayManager(displayElement, puzzleType, animationDuration);
    // Show the initial puzzle state.
    displayManager.initialDisplay();
    // Start the solving process.
    startSolver(solver, displayManager, animationDuration);
}

function toggleActive(...ids: Array<string>): void {
    ids.forEach((id) => document.getElementById(id)!.classList.toggle("active"));
}
function addActive(id: string): void {
    document.getElementById(id)!.classList.add("active");
}
function removeActive(id: string): void {
    document.getElementById(id)!.classList.remove("active");
}
function swapActive(id1: string, id2: string): void {
    if (!document.getElementById(id1)!.classList.contains("active")) {
        addActive(id1);
        removeActive(id2);
    }
}

document.getElementById("option-solve")!.addEventListener("click", () => {
    swapActive("solve-puzzle", "test-puzzle");
});
document.getElementById("option-test")!.addEventListener("click", () => {
    swapActive("test-puzzle", "solve-puzzle");
});

document.getElementById("display-animated")!.addEventListener("click", () => {
    addActive("animation-options");
});
document.getElementById("display-completed")!.addEventListener("click", () => {
    removeActive("animation-options");
});

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
addStatusInfoEvent("puzzle-display", "Show an animation of the puzzle being solved or just display the completed solution.");
addStatusInfoEvent("animation-speed", "How fast you want the animation to run.");

document.getElementById("menu")!.addEventListener("mouseleave", () => {
    updateStatusInfo("");
});

document.getElementById("go")!.addEventListener("click", solvePuzzle);
