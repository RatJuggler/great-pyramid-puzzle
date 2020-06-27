import { loadTestPuzzleAndPlaceTiles, loadPocketPuzzleAndPlaceTiles, loadGreatPuzzleAndPlaceTiles } from "./puzzle-loader";
import { displayPuzzle } from "./puzzle-display";


const testPuzzleDisplayData = {
    tileScale: 1,
    tilePositions: [
        {
            name: "1",
            center: {x: 0, y: 0, r: 0}
        }
    ]
}

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
            center: {x: 0, y: 0.015, r: 60}
        },
        {
            name: "4",
            center: {x: 0.433013, y: 0.25, r: 0}
        }
    ]
}

const greatPuzzleDisplayData = {
    tileScale: 0.32,
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

displayPuzzle(loadTestPuzzleAndPlaceTiles(), testPuzzleDisplayData);
// displayPuzzle(loadPocketPuzzleAndPlaceTiles(), pocketPuzzleDisplayData);
// displayPuzzle(loadGreatPuzzleAndPlaceTiles(), greatPuzzleDisplayData);
