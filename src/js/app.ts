// import { dumpPuzzles } from "./puzzle-console-dump";
import {SVG, Matrix, G, Path} from "@svgdotjs/svg.js";

// dumpPuzzles();

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

const tetrahedron = {
    faceScale: 90,
    faces: [
        {
            name: 1,
            center: {x: 0, y: 0, r: 60}
        },
        {
            name: 2,
            center: {x: 0, y: -1.05, r: 0}
        },
        {
            name: 3,
            center: {x: 0.916025, y: 0.525, r: 0}
        },
        {
            name: 4,
            center: {x: -0.916025, y: 0.525, r: 0}
        }
    ]
}

const testPuzzle = {
    tilePositionScale: 1,
    tilePositions: [
        {x: 0, y: 0, r: 0}
    ]
}

const pocketPuzzle = {
    tilePositionScale: 0.5,
    tilePositions: [
        {x: 0, y: -0.5, r: 0},
        {x: -0.433013, y: 0.25, r: 0},
        {x: 0, y: 0.015, r: 60},
        {x: 0.433013, y: 0.25, r: 0}
    ]
}

const greatPuzzle = {
    tilePositionScale: 0.333333,
    tilePositions: [
        {x: 0, y: -0.333333 * 2, r: 0},
        {x: -0.288675, y: -0.166667, r: 0},
        {x: 0, y: -0.333333, r: 60},
        {x: 0.288675, y: -0.166667, r: 0},
        {x: -0.288675 * 2, y: 0.333333, r: 0},
        {x: -0.288675, y: 0.166667, r: 60},
        {x: 0, y: 0.333333, r: 0},
        {x: 0.288675, y: 0.166667, r: 60},
        {x: 0.288675 * 2, y: 0.333333, r: 0}
    ]
}

function createTilePosition(fData: TriangleData, faceScale: number, tpData: TriangleData, tpScale: number): G {
    const tTilePosition = new Matrix(tpScale, 0, 0, tpScale, (fData.x + tpData.x) * faceScale, (fData.y + tpData.y) * faceScale);
    const tile = canvas.group();
    if (tpData.r === 0) {
        up_segments.forEach((segment) => tile.add(canvas.path(segment).fill(Math.random() > 0.5 ? '#ff0000' : '#ffffff').stroke('none')));
        tile.add(canvas.path(up_triangle).fill('none').stroke(black_line));
    } else {
        down_segments.forEach((segment) => tile.add(canvas.path(segment).fill(Math.random() > 0.5 ? '#ff0000' : '#ffffff').stroke('none')));
        tile.add(canvas.path(down_triangle).fill('none').stroke(black_line));
    }
    return tile.transform(tTilePosition).stroke(black_line);
}

function drawFace(fData: TriangleData, faceScale: number, tilePositions: TriangleData[], tpScale: number) {
    const fCenter = {x: fData.x * faceScale, y: fData.y * faceScale, r: fData.r};
    const tFace = new Matrix(faceScale, 0, 0, faceScale, fCenter.x, fCenter.y);
    const face = canvas.group();
    face.path(up_triangle).transform(tFace).fill('#f3f3f3').stroke(black_line);
    tilePositions.forEach((tpData) => face.add(createTilePosition(fData, faceScale, tpData, faceScale * tpScale)));
    face.rotate(fData.r, fCenter.x, fCenter.y);
    canvas.circle(1).translate(fCenter.x, fCenter.y).fill('#000').stroke(black_line);
}

const canvas = SVG().addTo("body").size("100%", "100%").viewbox("-200 -200 400 400");
// tetrahedron.faces.forEach((face) => drawFace(face.center, tetrahedron.faceScale,
//     testPuzzle.tilePositions, testPuzzle.tilePositionScale));
// tetrahedron.faces.forEach((face) => drawFace(face.center, tetrahedron.faceScale,
//     pocketPuzzle.tilePositions, pocketPuzzle.tilePositionScale));
tetrahedron.faces.forEach((face) => drawFace(face.center, tetrahedron.faceScale,
    greatPuzzle.tilePositions, greatPuzzle.tilePositionScale));
