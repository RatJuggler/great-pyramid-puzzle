import pocketdata from "../pocket-puzzle-data.json";
import { displayPuzzle } from "./puzzle-display";
import { loadPuzzleAndPlaceTiles } from "./puzzle-loader";


const pocketPuzzleDisplayData = {
    tileScale: 0.5,
    tilePositions: [
        {
            name: "1",
            center: {x: 0, y: -0.5, r: 0}
        },
        {
            name: "2",
            center: {x: -0.433013, y: 0.25, r: 0}
        },
        {
            name: "3",
            center: {x: 0.0, y: 0.0, r: 60}
        },
        {
            name: "4",
            center: {x: 0.433013, y: 0.25, r: 0}
        }
    ]
}

function pocketPuzzle() {
    displayPuzzle(loadPuzzleAndPlaceTiles(pocketdata), pocketPuzzleDisplayData);
}

export { pocketPuzzle }
