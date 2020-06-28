import greatdata from "../great-puzzle-data.json";
import { displayPuzzle } from "./puzzle-display";
import { loadPuzzleAndPlaceTiles } from "./puzzle-loader";


const greatPuzzleDisplayData = {
    tileScale: 0.34,
    tilePositions: [
        {
            name: "1",
            center: {x: 0, y: -0.333333 * 2, r: 0}
        },
        {
            name: "2",
            center: {x: -0.288675, y: -0.166667, r: 0}
        },
        {
            name: "3",
            center: {x: 0, y: -0.333333, r: 60}
        },
        {
            name: "4",
            center: {x: 0.288675, y: -0.166667, r: 0}
        },
        {
            name: "5",
            center: {x: -0.288675 * 2, y: 0.333333, r: 0}
        },
        {
            name: "6",
            center: {x: -0.288675, y: 0.166667, r: 60}
        },
        {
            name: "7",
            center: {x: 0, y: 0.333333, r: 0}
        },
        {
            name: "8",
            center: {x: 0.288675, y: 0.166667, r: 60}
        },
        {
            name: "9",
            center: {x: 0.288675 * 2, y: 0.333333, r: 0}
        }
    ]
}

function greatPuzzle() {
    displayPuzzle(loadPuzzleAndPlaceTiles(greatdata), greatPuzzleDisplayData);
}

export { greatPuzzle }
