import pocket_data from "../pocket-puzzle-data.json";


const pocketPuzzle = {
    puzzleData: pocket_data,
    displayData: {
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
}

export { pocketPuzzle }
