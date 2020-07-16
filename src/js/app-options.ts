import { testPuzzle } from "./test-puzzle";
import { pocketPuzzle } from "./pocket-puzzle";
import { greatPuzzle } from "./great-puzzle";
import { PuzzleDataElements } from "./common-data-schema";
import { Tile } from "./tile";
import { TilePool } from "./tile-pool";
import { TilePosition } from "./tile-position";
import { Tetrahedron } from "./tetrahedron";
import { Solver } from "./solver";
import { getRandomInt } from "./utils";


function getPuzzleTypeData(puzzleType: string): PuzzleDataElements {
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

function getTileSelection(tilePool: TilePool, tileSelection: string): Tile {
    switch (tileSelection) {
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

function rotateTile(tilePosition: TilePosition, tileRotation: string): TilePosition {
    switch (tileRotation) {
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

function placeTile(tile: Tile, tetrahedron: Tetrahedron, tilePlacement: string, tileRotation: string): TilePosition  {
    let tilePlacedPosition;
    switch (tilePlacement) {
        case "Random":
            tilePlacedPosition = tetrahedron.placeTileRandomly(tile);
            break;
        case "Sequential":
            tilePlacedPosition = tetrahedron.placeTileSequentially(tile);
            break;
        default:
            throw new Error("Invalid tile placement option!");
    }
    if (!tilePlacedPosition) {
        throw new Error("Failed to place tile on puzzle!");
    }
    return rotateTile(tilePlacedPosition, tileRotation);
}

function createSolverPromise(solver: Solver): { promise: Promise<unknown>; cancel: () => void; } {
    // Define completion flag and cancel trigger.
    let finished = false;
    let cancel = (): void => {
        finished = true;
    }
    // Create the promise to solve the puzzle.
    const promise = new Promise((resolve, reject) => {
        const id = setInterval(() => {
            const updatedTilePosition = solver.nextState();
            if (!updatedTilePosition) {
                clearInterval(id);
                resolve();
            }
        }, 50);
        // Triggering the cancel.
        cancel = (): void => {
            // If already completed no need to cancel.
            if (finished) {
                return;
            }
            // Process the cancel.
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

export { getPuzzleTypeData, getTileSelection, placeTile, createSolverPromise }
