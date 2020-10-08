import { DOMUIOptions } from "./ui-options";
import { getDisplayManager } from "./display/display-loader";
import { StatusUpdatesManager } from "./status-updates-manager";
import { SolverFacade, getSolverFacade, HumanFacade } from "./solver/solver-facade";
import { UIDragGroup } from "./ui-drag-group";


const displayElement = <SVGSVGElement> <any> document.getElementById("puzzle-display-area")!;

// Go/Cancel/Continue Buttons.

let solverFacade: SolverFacade;

function solvePuzzle(): void {
    const domUIOptions = new DOMUIOptions(document);
    const displayManager = getDisplayManager(displayElement, domUIOptions.solverOptions.puzzleType, domUIOptions.animationSpeed);
    const statusUpdatesList = document.getElementById("status-updates-list")!;
    const statusUpdates = new StatusUpdatesManager(document, statusUpdatesList);
    solverFacade = getSolverFacade(domUIOptions, displayManager, statusUpdates,
        document.getElementById("continue")!,
        document.getElementById("overlay")!);
    solverFacade.start();
}
function cancelPuzzle(): void {
    solverFacade.cancel();
}
function continuePuzzle(): void {
    solverFacade.continue();
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

document.getElementById("continue")!.addEventListener("enable", () => {
    enableContinue();
});
document.getElementById("continue")!.addEventListener("disable", () => {
    enableGo();
});

addClickEventListener("go", () => { solvePuzzle(); enableCancel(); });
addClickEventListener("cancel", () => { cancelPuzzle(); enableGo(); });
addClickEventListener("continue", () => { continuePuzzle(); enableCancel(); });

// Control which options are available as selections are made.

addClickEventListener("algorithm-genetic", () => { removeActive("no-matching-options"); });
addClickEventListener("algorithm-only-valid", () => { removeActive("no-matching-options"); });
addClickEventListener("algorithm-brute", () => { removeActive("no-matching-options"); });
addClickEventListener("algorithm-no-matching", () => { addActive("no-matching-options"); });

addClickEventListener("solution-animated", () => { addActive("algorithm-options"); addActive("animation-options"); });
addClickEventListener("solution-completed", () => { addActive("algorithm-options"); removeActive("animation-options"); });
addClickEventListener("solution-human", () => { removeActive("algorithm-options"); removeActive("animation-options"); });

addClickEventListener("menu-toggle", () => { toggleActive("layout", "menu", "menu-toggle") });


// Set the text to show for each option area.

addMenuHelpEvent("go", "Start a new puzzle solving process with the selected options.");
addMenuHelpEvent("cancel", "Cancel the solution in progress.");
addMenuHelpEvent("continue", "Continue with the current options to try to find another solution.");
addMenuHelpEvent("puzzle-type", "Select the difficulty of puzzle to work with.");
addMenuHelpEvent("solution-option", "Show an animation of the puzzle being solved, just display the completed solution or try it yourself.");
addMenuHelpEvent("solve-algorithm", "Select which algorithm to use when solving the puzzle.");
addMenuHelpEvent("tile-selection", "How tiles are selected for the test display, randomly, in order or to use a fixed tile pattern.");
addMenuHelpEvent("tile-placement", "How tiles are placed on the test display, randomly or in order.");
addMenuHelpEvent("tile-rotation", "If tiles are randomly rotated before being placed on the test display.");
addMenuHelpEvent("animation-speed", "How fast you want the animation to run.");

function defaultMenuHelp() {
    updateMenuHelp("The Great Pyramid Puzzle is by Eliot Inventions Ltd from 1981, this is my just my digital version.");
}

defaultMenuHelp();

document.getElementById("menu")!.addEventListener("mouseleave", defaultMenuHelp);


// Control dragging of puzzle pieces for the human solution.

let dragGroup: UIDragGroup | null = null;

function startDrag(evt: MouseEvent): void {
    dragGroup = new UIDragGroup(document, displayElement);
    if (!dragGroup.validDrag(evt)) {
        dragGroup = null;
    }
}
function drag(evt: MouseEvent): void {
    if (dragGroup) {
        evt.preventDefault();
        dragGroup.drag(evt);
    }
}
function endDrag(evt: MouseEvent): void {
    if (dragGroup) {
        dragGroup.endDrag(evt);
        (<HumanFacade> solverFacade).userMove(dragGroup);
        dragGroup = null;
    }
}

displayElement.addEventListener('mousedown', startDrag);
displayElement.addEventListener('mousemove', drag);
displayElement.addEventListener('mouseup', endDrag);
displayElement.addEventListener('mouseleave', endDrag);


// Functions to simplify DOM changes as used by the above.

function addClickEventListener(id: string, callback: (this:HTMLElement, evt: MouseEvent) => any): void {
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

function updateMenuHelp(innerText: string) {
    document.getElementById("menu-help")!.innerText = innerText;
}
function addMenuHelpEvent(id: string, statusInfo: string) {
    document.getElementById(id)!.addEventListener("mouseenter", () => {
        updateMenuHelp(statusInfo);
    });
}

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
