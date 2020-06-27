import { SVG, Matrix, G } from "@svgdotjs/svg.js";
import { loadTestPuzzleAndPlaceTiles } from "./puzzle-loader";
import { Face } from "./face";
import { Tile } from "./tile";


const up_triangle = 'M 0 -1 L -0.866025 0.5 L 0.866025,0.5 L 0 -1 Z';
const up_segments = [
    'M 0 0 L 0 -1            L 0.288675 -0.5   L 0 0 Z',
    'M 0 0 L 0.288675 -0.5   L 0.433013 -0.25  L 0 0 Z',
    'M 0 0 L 0.433013 -0.25  L 0.577350 0      L 0 0 Z',
    'M 0 0 L 0.577350 0      L 0.866025 0.5    L 0 0 Z',
    'M 0 0 L 0.866025 0.5    L 0.288675 0.5    L 0 0 Z',
    'M 0 0 L 0.288675 0.5    L 0 0.5           L 0 0 Z',
    'M 0 0 L 0 0.5           L -0.288675 0.5   L 0 0 Z',
    'M 0 0 L -0.288675 0.5   L -0.866025 0.5   L 0 0 Z',
    'M 0 0 L -0.866025 0.5   L -0.577350 0     L 0 0 Z',
    'M 0 0 L -0.577350 0     L -0.433013 -0.25 L 0 0 Z',
    'M 0 0 L -0.433013 -0.25 L -0.288675 -0.5  L 0 0 Z',
    'M 0 0 L -0.288675 -0.5  L 0 -1            L 0 0 Z'
]

const down_triangle = 'M 0 1 L 0.866025 -0.55 L -0.866025 -0.55 L 0 1 Z';
const down_segments = [
    'M 0 0 L 0 1            L 0.288675 0.5   L 0 0 Z',
    'M 0 0 L 0.288675 0.5   L 0.433013 0.25  L 0 0 Z',
    'M 0 0 L 0.433013 0.25  L 0.577350 0     L 0 0 Z',
    'M 0 0 L 0.577350 0     L 0.866025 -0.5  L 0 0 Z',
    'M 0 0 L 0.866025 -0.5  L 0.288675 -0.5  L 0 0 Z',
    'M 0 0 L 0.288675 -0.5  L 0,-0.5         L 0 0 Z',
    'M 0 0 L 0 -0.5         L -0.288675,-0.5 L 0 0 Z',
    'M 0 0 L -0.288675 -0.5 L -0.866025 -0.5 L 0 0 Z',
    'M 0 0 L -0.866025 -0.5 L -0.577350 0    L 0 0 Z',
    'M 0 0 L -0.577350 0    L -0.433013 0.25 L 0 0 Z',
    'M 0 0 L -0.433013 0.25 L -0.288675 0.5  L 0 0 Z',
    'M 0 0 L -0.288675 0.5  L 0 1            L 0 0 Z'
]

const black_line = {width: 0.01, color: '#000000'};

interface TriangleData {
    readonly x: number,
    readonly y: number,
    readonly r: number,
}

interface PositionData {
    readonly name: string,
    readonly center: TriangleData
}

const tetrahedron = {
    faceScale: 90,
    faces: [
        {
            name: "1",
            center: {x: 0, y: 0, r: 60}
        },
        {
            name: "2",
            center: {x: 0, y: -1.05, r: 0}
        },
        {
            name: "3",
            center: {x: 0.916025, y: 0.525, r: 0}
        },
        {
            name: "4",
            center: {x: -0.916025, y: 0.525, r: 0}
        }
    ]
}

const testPuzzle = {
    tilePositionScale: 1,
    tilePositions: [
        {
            name: "1",
            center: {x: 0, y: 0, r: 0}
        }
    ]
}

const pocketPuzzle = {
    tilePositionScale: 0.5,
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

const greatPuzzle = {
    tilePositionScale: 0.32,
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

function createTilePosition(fData: TriangleData, faceScale: number, tpData: TriangleData, tpScale: number, tile: Tile | null): G {
    const tTilePosition =
        new Matrix(tpScale, 0, 0, tpScale, (fData.x + tpData.x) * faceScale, (fData.y + tpData.y) * faceScale);
    const tileSegments = canvas.group();
    if (tile == null) {
        const drawTriangle = tpData.r === 0 ? up_triangle : down_triangle;
        tileSegments.add(canvas.path(drawTriangle).fill('#e6e6e6').stroke(black_line));
    } else {
        const drawSegments = tpData.r === 0 ? up_segments : down_segments;
        const segments = tile.segments;
        for (let segN = 0; segN < drawSegments.length; segN++) {
            tileSegments.add(canvas.path(drawSegments[segN])
                .fill(segments.charAt(segN) === '1' ? '#ff0000' : '#ffffff').stroke('none'));
        }
    }
    return tileSegments.transform(tTilePosition);
}

function drawFace(fData: TriangleData, faceScale: number, puzzleFace: Face, tilePositions: PositionData[], tpScale: number) {
    const fCenter = {x: fData.x * faceScale, y: fData.y * faceScale, r: fData.r};
    const tFace = new Matrix(faceScale, 0, 0, faceScale, fCenter.x, fCenter.y);
    const face = canvas.group();
    face.path(up_triangle).transform(tFace).fill('#f3f3f3').stroke(black_line);
    tilePositions.forEach((tpData) => {
        const tile = puzzleFace.getTileAtPosition(tpData.name);
        face.add(createTilePosition(fData, faceScale, tpData.center, faceScale * tpScale, tile))
    });
    face.rotate(fData.r, fCenter.x, fCenter.y);
    canvas.circle(1).translate(fCenter.x, fCenter.y).fill('#000').stroke(black_line);
}

const puzzle = loadTestPuzzleAndPlaceTiles();
const canvas = SVG().addTo("body").size("100%", "100%").viewbox("-200 -200 400 400");
tetrahedron.faces.forEach((face) => {
    const puzzleFace = puzzle.getFace(face.name);
    drawFace(face.center, tetrahedron.faceScale, puzzleFace, testPuzzle.tilePositions, testPuzzle.tilePositionScale)
});
// tetrahedron.faces.forEach((face) => drawFace(face.center, tetrahedron.faceScale,
//     pocketPuzzle.tilePositions, pocketPuzzle.tilePositionScale));
// tetrahedron.faces.forEach((face) => drawFace(face.center, tetrahedron.faceScale,
//     greatPuzzle.tilePositions, greatPuzzle.tilePositionScale));
