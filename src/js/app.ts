import { getDisplayManager } from "./display-loader";
import { SolverFacade, AnimatedFacade, WorkerFacade } from "./solver-facade";
import { SolverOptions } from "./solver-factory";
import { DisplayManager } from "./display-manager";


let solverFacade: SolverFacade;


function getSelector(name: string): string {
    const selection  = document.querySelectorAll(`input[name = "${name}"]`) as NodeListOf<HTMLInputElement>;
    for (const rb of selection) {
        if (rb.checked) {
            return rb.value;
        }
    }
    throw new Error("Expected radio option to be selected!");
}

function getAnimationSpeed(): number {
    return parseInt(getSelector("animation-speed"));
}

function getSolverFacade(solverOptions: SolverOptions, displayManager: DisplayManager): SolverFacade {
    const displayOption = getSelector("display-option");
    switch (displayOption) {
        case "Completed":
            // Worker solver needs to know where the overlay element is.
            return new WorkerFacade(solverOptions, displayManager, document.getElementById("overlay")!);
        case "Animated":
            // Animated solver needs to know the animation speed.
            return new AnimatedFacade(solverOptions, displayManager, getAnimationSpeed());
        default:
            throw new Error("Invalid solve display option!");
    }
}

function solvePuzzle(): void {
    // Determine the solver options.
    const solverOptions: SolverOptions = {
        puzzleType: getSelector("puzzle-type"),
        solveAlgorithm: getSelector("solve-algorithm"),
        tileSelection: getSelector("tile-selection"),
        tilePlacement: getSelector("tile-placement"),
        tileRotation: getSelector("tile-rotation"),
    };
    // Find where we want the puzzle displayed.
    const displayElement = <HTMLElement>document.getElementById("puzzle-display-area")!;
    // Build the display manager.
    const displayManager = getDisplayManager(displayElement, solverOptions.puzzleType, getAnimationSpeed());
    // Build the solver facade.
    solverFacade = getSolverFacade(solverOptions, displayManager);
    // Start the solving process.
    solverFacade.start();
}

function cancelPuzzle(): void {
    solverFacade.cancel();
}

function continuePuzzle(): void {
    solverFacade.continue();
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
document.getElementById("algorithm-only-valid")!.addEventListener("click", () => {
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

function updateMenuHelp(innerText: string) {
    document.getElementById("menu-help")!.innerText = innerText;
}

function addMenuHelpEvent(id: string, statusInfo: string) {
    document.getElementById(id)!.addEventListener("mouseenter", () => {
        updateMenuHelp(statusInfo);
    });
}

addMenuHelpEvent("go", "Proceed with the selected options.");
addMenuHelpEvent("cancel", "Cancel the solution in progress.");
addMenuHelpEvent("continue", "Continue to find another solution.");
addMenuHelpEvent("puzzle-type", "Select the difficulty of puzzle to work with.");
addMenuHelpEvent("solve-algorithm", "Select which algorithm to use when solving the puzzle.");
addMenuHelpEvent("tile-selection", "How tiles are selected for the test display, randomly, in order or to use a fixed tile pattern.");
addMenuHelpEvent("tile-placement", "How tiles are placed on the test display, randomly or in order.");
addMenuHelpEvent("tile-rotation", "If tiles are randomly rotated before being placed on the test display.");
addMenuHelpEvent("puzzle-display", "Show an animation of the puzzle being solved or just display the completed solution.");
addMenuHelpEvent("animation-speed", "How fast you want the animation to run.");

document.getElementById("menu")!.addEventListener("mouseleave", () => {
    updateMenuHelp("");
});

function enableButton(id: string): void {
    const button = document.getElementById(id)!;
    button.classList.remove("pure-button-disabled");
    button.classList.add("pure-button-active");
}
function disableButton(id: string): void {
    const button = document.getElementById(id)!;
    button.classList.remove("pure-button-active");
    button.classList.add("pure-button-disabled");
}

document.getElementById("go")!.addEventListener("click", () => {
    solvePuzzle();
    disableButton("go");
    enableButton("cancel");
    disableButton("continue");
    document.getElementById('selection-options')!.classList.add("pure-button-disabled");
});

document.getElementById("cancel")!.addEventListener("click", () => {
    cancelPuzzle();
    enableButton("go");
    disableButton("cancel");
    document.getElementById('selection-options')!.classList.remove("pure-button-disabled");
});

document.getElementById("continue")!.addEventListener("click", () => {
    continuePuzzle();
    disableButton("go");
    enableButton("cancel");
    disableButton("continue");
    document.getElementById('selection-options')!.classList.add("pure-button-disabled");
});
