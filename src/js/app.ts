import { DOMUIOptions } from "./ui-options";
import { getDisplayManager } from "./display-loader";
import { SolverFacade, getSolverFacade} from "./solver-facade";


let solverFacade: SolverFacade;

function solvePuzzle(): void {
    // Determine the solver options.
    const domUIOptions = new DOMUIOptions(document);
    const solverOptions = domUIOptions.solverOptions;
    // Find where we want the puzzle displayed.
    const displayElement = <HTMLElement>document.getElementById("puzzle-display-area")!;
    // Build the display manager.
    const displayManager = getDisplayManager(displayElement, solverOptions.puzzleType, domUIOptions.animationSpeed);
    // Build the solver facade.
    solverFacade = getSolverFacade(domUIOptions, displayManager,
        document.getElementById("continue")!,
        document.getElementById("overlay")!);
    // Start the solving process.
    solverFacade.start();
}

function cancelPuzzle(): void {
    solverFacade.cancel();
}

function continuePuzzle(): void {
    solverFacade.continue();
}


function addClickEventListener(id: string, callback: (this:HTMLElement, ev: MouseEvent) => any): void {
    document.getElementById(id)!.addEventListener("click", callback);
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

addClickEventListener("algorithm-no-matching", () => { addActive("no-matching-options"); });
addClickEventListener("algorithm-brute", () => { removeActive("no-matching-options"); });
addClickEventListener("algorithm-only-valid", () => { removeActive("no-matching-options"); });

addClickEventListener("display-animated", () => { addActive("animation-options"); });
addClickEventListener("display-completed", () => { removeActive("animation-options"); });

addClickEventListener("menu-toggle", () => { toggleActive("layout", "menu", "menu-toggle") });

function updateMenuHelp(innerText: string) {
    document.getElementById("menu-help")!.innerText = innerText;
}

function addMenuHelpEvent(id: string, statusInfo: string) {
    document.getElementById(id)!.addEventListener("mouseenter", () => {
        updateMenuHelp(statusInfo);
    });
}

addMenuHelpEvent("go", "Start a new puzzle solving process with the selected options.");
addMenuHelpEvent("cancel", "Cancel the solution in progress.");
addMenuHelpEvent("continue", "Continue with the current options to try to find another solution.");
addMenuHelpEvent("puzzle-type", "Select the difficulty of puzzle to work with.");
addMenuHelpEvent("solve-algorithm", "Select which algorithm to use when solving the puzzle.");
addMenuHelpEvent("tile-selection", "How tiles are selected for the test display, randomly, in order or to use a fixed tile pattern.");
addMenuHelpEvent("tile-placement", "How tiles are placed on the test display, randomly or in order.");
addMenuHelpEvent("tile-rotation", "If tiles are randomly rotated before being placed on the test display.");
addMenuHelpEvent("puzzle-display", "Show an animation of the puzzle being solved or just display the completed solution.");
addMenuHelpEvent("animation-speed", "How fast you want the animation to run.");

function defaultMenuHelp() {
    updateMenuHelp("The Great Pyramid Puzzle is by Eliot Inventions Ltd from 1981, this is my just my digital version.");
}

defaultMenuHelp();

document.getElementById("menu")!.addEventListener("mouseleave", defaultMenuHelp);

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

function enableMenu(): void {
    const menu = document.getElementById('selection-options')!;
    menu.classList.remove("pure-button-disabled");
}
function disableMenu(): void {
    const menu = document.getElementById('selection-options')!;
    menu.classList.add("pure-button-disabled");
}

function enableGo(): void {
    enableButton("go");
    disableButton("cancel");
    disableButton("continue");
    enableMenu();
}
function enableCancel(): void {
    disableButton("go");
    enableButton("cancel");
    disableButton("continue");
    disableMenu();
}
function enableContinue(): void {
    enableButton("go");
    disableButton("cancel");
    enableButton("continue");
    enableMenu();
}

addClickEventListener("go", () => { solvePuzzle(); enableCancel(); });
addClickEventListener("cancel", () => { cancelPuzzle(); enableGo(); });
addClickEventListener("continue", () => { continuePuzzle(); enableCancel(); });

document.getElementById("continue")!.addEventListener("enable", () => {
    enableContinue();
});
document.getElementById("continue")!.addEventListener("disable", () => {
    enableGo();
});
