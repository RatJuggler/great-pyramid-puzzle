import { getDisplayManager } from "./display-loader";
import { DisplayManager } from "./display-manager";
import { PuzzleChange } from "./puzzle-changes";
import { Solver } from "./solver-base";
import { SolverOptions, buildSolver } from "./solver-factory";
import { Timer } from "./timer";


// Track animated solver timer.
let solverTimeoutId: number;
// Track solver worker.
let solverWorker: Worker;
// Track how long solvers run for.
const solverTimer = new Timer();


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
                    displayManager.display(PuzzleChange.rotate(tpId[0]))
                );
            }
        });
}

function startWorkerSolver(solverOptions: SolverOptions, displayManager: DisplayManager): void {
    // Set the overlay to prevent further UI interaction.
    addActive("overlay");
    // Create a new work and an event to deal with the result.
    solverWorker = new Worker("worker.ts");
    solverWorker.onmessage = (e) => {
        // Stop the timer and log the result.
        solverTimer.stop();
        console.log("Elapsed time: " + solverTimer.elapsed());
        // Show the final puzzle state.
        const finalState = <Array<PuzzleChange>> e.data;
        finalState.forEach((tpChange) => displayManager.display(tpChange));
        attachRotateEvents(displayManager);
        removeActive("overlay");
    }
    // Attach a cancel trigger to the overlay.
    document.getElementById("overlay")!.addEventListener("click", () => {
        solverWorker.terminate();
        removeActive("overlay");
    });
    // Kick off the worker solver.
    solverTimer.start();
    solverWorker.postMessage(solverOptions);
}

function runAnimatedSolver(solver: Solver, displayManager: DisplayManager, animateDuration: number): void {
    // Schedule a series of events to animate placing tiles on the puzzle.
    solverTimeoutId = setTimeout( () => {
        const puzzleChange = solver.nextState();
        if (puzzleChange.isSolved()) {
            clearInterval(solverTimeoutId)
            // Stop the timer and log the result.
            solverTimer.stop();
            console.log("Elapsed time: " + solverTimer.elapsed());
            attachRotateEvents(displayManager);
        } else {
            displayManager.display(puzzleChange);
            runAnimatedSolver(solver, displayManager, animateDuration);
        }
    }, animateDuration + 20);
}

function startAnimatedSolver(solverOptions: SolverOptions, displayManager: DisplayManager, animationDuration: number): void {
    // Build the solver to use.
    const solver = buildSolver(solverOptions);
    // Kick off the animated solver.
    solverTimer.start();
    runAnimatedSolver(solver, displayManager, animationDuration);
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
    if (solverTimeoutId) {
        clearInterval(solverTimeoutId);
    }
    if (solverWorker) {
        solverWorker.terminate();
    }
    // Determine the puzzle solver options.
    const solverOptions = {
        puzzleType: getSelector("puzzle-type"),
        solveAlgorithm: getSelector("solve-algorithm"),
        tileSelection: getSelector("tile-selection"),
        tilePlacement: getSelector("tile-placement"),
        tileRotation: getSelector("tile-rotation")
    };
    // Decide on the animation speed.
    const animationDuration = getSpeed();
    // Find where we want the puzzle displayed.
    const displayElement = <HTMLElement>document.getElementById("puzzle-display-area")!;
    // Build a display manager.
    const displayManager = getDisplayManager(displayElement, solverOptions.puzzleType, animationDuration);
    // Show the initial puzzle state.
    displayManager.initialDisplay();
    // Start the solving process.
    if (animationDuration === 0) {
        startWorkerSolver(solverOptions, displayManager);
    } else {
        startAnimatedSolver(solverOptions, displayManager, animationDuration);
    }
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

document.getElementById("algorithm-no-matching")!.addEventListener("click", () => {
    addActive("no-matching-options");
});
document.getElementById("algorithm-brute")!.addEventListener("click", () => {
    removeActive("no-matching-options");
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
