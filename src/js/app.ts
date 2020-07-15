import { getPuzzleTypeData, createSolverPromise } from "./app-options";
import { getPuzzleComponents } from "./puzzle-loader";
import { PuzzleComponents } from "./common-data-schema";
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

function attachRotateEvents(puzzle: PuzzleComponents): void {
    document.querySelectorAll("g")
        .forEach(function (svgGroup) {
            const tpId = svgGroup.id.match(/^([1-4])-([1-9])$/);
            if (tpId) {
                svgGroup.addEventListener("click", (e) => {
                    const tilePosition = puzzle.tetrahedron.getFace(tpId[1]).getTilePosition(tpId[2]);
                    if (!tilePosition.isEmpty()) {
                        tilePosition.rotateTile();
                        puzzle.displayManager.rotateTile(<HTMLElement> e.target);
                    }
                });
            }
        });
}

function animateSolve(puzzle: PuzzleComponents, solver: Solver): void {
    // Schedule a series of events to place tiles on the puzzle.
    animatedDisplayId = setTimeout( () => {
        const updatedTilePosition = solver.nextState();
        if (updatedTilePosition) {
            puzzle.displayManager.redrawTilePosition(updatedTilePosition!);
            animateSolve(puzzle, solver);
        } else {
            attachRotateEvents(puzzle);
        }
    }, 1000);
}

function completeSolve(puzzle: PuzzleComponents, solver: Solver): void {
    // Set the overlay to prevent further UI interaction.
    showElement("overlay");
    // Start the solving process.
    const solving = createSolverPromise(solver);
    solving.promise.then((resolvedValue) => {
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
    // Determine the data required for the puzzle.
    const puzzleTypeData = getPuzzleTypeData(getSelector("puzzle-type"));
    // Find where we want the puzzle displayed.
    const displayElement = <HTMLElement>document.getElementById("puzzle-display-area")!;
    // Build internal puzzle representation, pool of tiles waiting to be placed on it and a display manager to show it.
    const puzzle = getPuzzleComponents(puzzleTypeData, displayElement);
    // Show the initial puzzle state.
    puzzle.displayManager.displayPuzzle(puzzle.tetrahedron);
    // Build the solver to use.
    const solver = getSolveAlgorithm(puzzle);
    // Solve the puzzle depending on the display.
    const display = getSelector("puzzle-display");
    switch (display) {
        case "Completed":
            completeSolve(puzzle, solver);
            break;
        case "Animated":
            animateSolve(puzzle, solver);
            break;
        default:
            throw new Error("Invalid solve display option!");
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
addStatusInfoEvent("puzzle-option", "Select to try the various test display options, without solving the puzzle, or to try and solve the puzzle.");
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

document.getElementById("go")!.addEventListener("click", () => solvePuzzle());
