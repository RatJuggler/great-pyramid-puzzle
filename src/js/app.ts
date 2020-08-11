import { DOMUIOptions } from "./ui-options";
import { getDisplayManager } from "./display/display-loader";
import { StatusUpdatesManager } from "./status-updates-manager";
import { SolverFacade, getSolverFacade} from "./solver/solver-facade";
import { Coords, UIDragGroup } from "./ui-drag-group";


const displayElement = <SVGSVGElement> <any> document.getElementById("puzzle-display-area")!;

let solverFacade: SolverFacade;

function solvePuzzle(): void {
    // Determine the solver options.
    const domUIOptions = new DOMUIOptions(document);
    const solverOptions = domUIOptions.solverOptions;
    // Build the display manager.
    const displayManager = getDisplayManager(displayElement, solverOptions.puzzleType, domUIOptions.animationSpeed);
    // Build the status list manager.
    const statusUpdatesList = document.getElementById("status-updates-list")!;
    const statusUpdates = new StatusUpdatesManager(document, statusUpdatesList);
    // Build the solver facade.
    solverFacade = getSolverFacade(domUIOptions, displayManager, statusUpdates,
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

addClickEventListener("algorithm-genetic", () => { removeActive("no-matching-options"); });
addClickEventListener("algorithm-only-valid", () => { removeActive("no-matching-options"); });
addClickEventListener("algorithm-brute", () => { removeActive("no-matching-options"); });
addClickEventListener("algorithm-no-matching", () => { addActive("no-matching-options"); });

addClickEventListener("solution-animated", () => { addActive("algorithm-options"); addActive("animation-options"); });
addClickEventListener("solution-completed", () => { addActive("algorithm-options"); removeActive("animation-options"); });
addClickEventListener("solution-human", () => { removeActive("algorithm-options"); removeActive("animation-options"); });

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


let dragGroup: UIDragGroup | null = null;

function getMousePosition(evt: MouseEvent): Coords {
    let CTM = displayElement.getScreenCTM()!;
    return {
        x: (evt.clientX - CTM.e) / CTM.a,
        y: (evt.clientY - CTM.f) / CTM.d
    };
}

function startDrag(evt: MouseEvent): void {
    if (evt.target) {
        let node = (<Element> evt.target).parentNode;
        // Only Tile groups should have been made draggable.
        if (node && (<Element> node).classList.contains('draggable-group')) {
            dragGroup = new UIDragGroup(<SVGGElement> node, getMousePosition(evt));
        }
    }
}

function drag(evt: MouseEvent): void {
    if (dragGroup) {
        evt.preventDefault();
        dragGroup.drag(getMousePosition(evt));
    }
}

function endDrag(evt: MouseEvent): void {
    if (dragGroup) {
        dragGroup.endDrag(document, evt);
        dragGroup = null;
    }
}

displayElement.addEventListener('mousedown', startDrag);
displayElement.addEventListener('mousemove', drag);
displayElement.addEventListener('mouseup', endDrag);
displayElement.addEventListener('mouseleave', endDrag);
