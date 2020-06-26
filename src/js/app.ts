// import { dumpPuzzles } from "./puzzle-console-dump";
import {SVG, Matrix, Path} from "@svgdotjs/svg.js";

// dumpPuzzles();

const up_triangle = 'M 0 -1 L -0.866025 0.5 L 0.866025,0.5 L 0 -1 Z';
const down_triangle = 'M 0 1 L 0.866025 -0.55 L -0.866025 -0.55 L 0 1 Z';

const black_line = {width: 0.005, color: '#000000'};

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
    tilePositionScale: 0.9,
    tilePositions: [
        {x: 0, y: 0, r: 0}
    ]
}

const pocketPuzzle = {
    tilePositionScale: 0.425,
    tilePositions: [
        {x: 0, y: -0.45, r: 0},
        {x: -0.393061, y: 0.2375, r: 0},
        {x: 0, y: 0, r: 60},
        {x: 0.393061, y: 0.2375, r: 0}
    ]
}

const greatPuzzle = {
    tilePositionScale: 0.266667,
    tilePositions: [
        {x: 0, y: -0.291667 * 2, r: 0},
        {x: -0.255940, y: -0.158333, r: 0},
        {x: 0, y: -0.291667, r: 60},
        {x: 0.255940, y: -0.158333, r: 0},
        {x: -0.255940 * 2, y: 0.291667, r: 0},
        {x: -0.255940, y: 0.158333, r: 60},
        {x: 0, y: 0.291667, r: 0},
        {x: 0.255940, y: 0.158333, r: 60},
        {x: 0.255940 * 2, y: 0.291667, r: 0}
    ]
}

function createTilePosition(fData: TriangleData, faceScale: number, tpData: TriangleData, tpScale: number): Path {
    const tTilePosition = new Matrix(tpScale, 0, 0, tpScale, (fData.x + tpData.x) * faceScale, (fData.y + tpData.y) * faceScale);
    return canvas.path(tpData.r === 0 ? up_triangle : down_triangle).transform(tTilePosition)
        .fill('#e6e6e6').stroke(black_line);
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
