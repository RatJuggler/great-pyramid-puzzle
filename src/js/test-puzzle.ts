import testdata from "../test-puzzle-data.json";
import { displayPuzzle } from "./puzzle-display";
import { loadPuzzleAndPlaceTiles } from "./puzzle-loader";


const testPuzzleDisplayData = {
    tileScale: 1,
    tilePositions: [
        {
            name: "1",
            center: {x: 0, y: 0, r: 0}
        }
    ]
}

function testPuzzle() {
    displayPuzzle(loadPuzzleAndPlaceTiles(testdata), testPuzzleDisplayData);
}

export { testPuzzle }
