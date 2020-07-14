import { testPuzzle } from "./test-puzzle";
import { pocketPuzzle } from "./pocket-puzzle";
import { greatPuzzle } from "./great-puzzle";
import { PuzzleDataElements } from "./common-data-schema";
import { TilePool } from "./tile-pool";
import { Tile } from "./tile";
import { TilePosition } from "./tile-position";
import { getRandomInt } from "./utils";
import { Tetrahedron } from "./tetrahedron";


function getSelector(name: string): string {
    const selection  = <NodeListOf<HTMLInputElement>>document.querySelectorAll(`input[name = "${name}"]`)!;
    for (const rb of selection) {
        if (rb.checked) {
            return rb.value;
        }
    }
    throw new Error("Expected radio option to be selected!");
}

function getPuzzleTypeData(): PuzzleDataElements {
    const puzzleType = getSelector("puzzle-type");
    switch (puzzleType) {
        case "Test":
            return testPuzzle;
        case "Pocket":
            return pocketPuzzle;
        case "Great":
            return greatPuzzle;
        default:
            throw new Error("Invalid puzzle type option!");
    }
}

function getTileSelection(tilePool: TilePool): Tile | null {
    const selection = getSelector("tile-selection");
    switch (selection) {
        case "Random":
            return tilePool.randomTile;
        case "Sequential":
            return tilePool.nextTile;
        case "Test":
            return tilePool.testTile;
        default:
            throw new Error("Invalid tile selection option!");
    }
}

function rotateTile(tilePosition: TilePosition): TilePosition {
    const rotation = getSelector("tile-rotation");
    switch (rotation) {
        case "None":
            return tilePosition;
        case "Random":
            for (let i = getRandomInt(3); i > 0; --i) {
                tilePosition.rotateTile();
            }
            return tilePosition;
        default:
            throw new Error("Invalid tile rotation option!");
    }
}

function placeTile(tile: Tile, tetrahedron: Tetrahedron): TilePosition  {
    const placement = getSelector("tile-placement");
    let tilePlacedPosition;
    switch (placement) {
        case "Random":
            tilePlacedPosition = tetrahedron.placeTileRandomly(tile);
            break;
        case "Sequential":
            tilePlacedPosition = tetrahedron.placeTileSequentially(tile);
            break
        default:
            throw new Error("Invalid tile placement option!");
    }
    if (!tilePlacedPosition) {
        throw new Error("Failed to place tile on puzzle!");
    }
    return rotateTile(tilePlacedPosition);
}

function createSolverPromise(solver: (id: number, resolve: () => void, tetrahedron: Tetrahedron, tilePool: TilePool) => void,
                             tetrahedron: Tetrahedron, tilePool: TilePool): { promise: Promise<unknown>; cancel: () => void; } {
    // Define completion flag and cancel trigger.
    let finished = false;
    let cancel = (): void => {
        finished = true;
    }
    // Create the promise to solve the puzzle.
    const promise = new Promise((resolve, reject) => {
        const id = setInterval(() => {
            solver(id, resolve, tetrahedron, tilePool);
        }, 250);
        // Triggering the cancel.
        cancel = (): void => {
            // If already completed no need to cancel.
            if (finished) {
                return;
            }
            // Process the cancel.
            console.log("Cancelling...");
            clearInterval(id);
            reject();
        }
        // If cancelled before promise is started.
        if (finished) {
            cancel();
        }
    })
        // Always set 'finished', so further cancelling has no effect.
        // Note: Can't use finally here as we have targeted ES2016.
        .then((resolvedValue) => {
            finished = true;
            return resolvedValue;
        })
        .catch((err) => {
            finished = true;
            return err;
        });
    return { promise, cancel }
}

export { getSelector, getPuzzleTypeData, getTileSelection, placeTile, createSolverPromise }
