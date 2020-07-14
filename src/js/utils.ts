import {Tetrahedron} from "./tetrahedron";
import {TilePool} from "./tile-pool";

// Useful utility functions.

function getRandomInt(n: number): number {
    return Math.floor(Math.random() * Math.floor(n));
}

function createPromise(solver: (id: number, resolve: () => void, tetrahedron: Tetrahedron, tilePool: TilePool) => void,
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
        }, 1000);
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

export { getRandomInt, createPromise }
