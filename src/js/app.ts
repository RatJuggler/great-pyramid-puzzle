// import { dumpPuzzles } from "./puzzle-console-dump";
import {SVG, Matrix, Path} from "@svgdotjs/svg.js";

// dumpPuzzles();

const up_triangle = 'M 24.6408 14.2264 L 0 -28.4528 L -24.6408 14.2264 L 24.6408 14.2264 Z';
const down_triangle = 'M -24.6408 -14.2264 L 0 28.4528 L 24.6408 -14.2264 L -24.6408 -14.2264 Z';

const black_line = {width: 0.25, color: '#000000'};

interface TriangleData {
    readonly x: number,
    readonly y: number,
    readonly r: number,
}

const tetrahedron = {
    faceScale: 1,
    faces: [
        {
            name: 1,
            center: {x: 0, y: 0, r: 60}
        },
        {
            name: 2,
            center: {x: 0, y: -29.8754, r: 0}
        },
        {
            name: 3,
            center: {x: 26.0634, y: 14.9377, r: 0}
        },
        {
            name: 4,
            center: {x: -26.0634, y: 14.9377, r: 0}
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
    tilePositionScale: 0.46,
    tilePositions: [
        {x: 0, y: -45, r: 0},
        {x: -39.3061, y: 23.75, r: 0},
        {x: 0, y: 0, r: 60},
        {x: 39.3061, y: 23.75, r: 0}
    ]
}

const greatPuzzle = {
    tilePositionScale: 0.2667,
    tilePositions: [
        {x: 0, y: -29.1667 * 2, r: 0},
        {x: -25.5940, y: -15.8333, r: 0},
        {x: 0, y: -29.1667, r: 60},
        {x: 25.5940, y: -15.8333, r: 0},
        {x: -25.5940 * 2, y: 29.1667, r: 0},
        {x: -25.5940, y: 15.8333, r: 60},
        {x: 0, y: 29.1667, r: 0},
        {x: 25.5940, y: 15.8333, r: 60},
        {x: 25.5940 * 2, y: 29.1667, r: 0}
    ]
}

function createTilePosition(fCenter: TriangleData, tpData: TriangleData, tpScale: number): Path {
    const tTilePosition = new Matrix(tpScale, 0, 0, tpScale, fCenter.x + tpData.x, fCenter.y + tpData.y);
    return canvas.path(tpData.r === 0 ? up_triangle : down_triangle).transform(tTilePosition)
        .fill('#e6e6e6').stroke(black_line);
}

function drawFace(fData: TriangleData, faceScale: number, tilePositions: TriangleData[], tpScale: number) {
    const fScale = faceScale * 3;
    const fCenter = {x: fData.x * fScale, y: fData.y * fScale, r: fData.r};
    const tFace = new Matrix(fScale, 0, 0, fScale, fCenter.x, fCenter.y);
    const face = canvas.group();
    face.path(up_triangle).transform(tFace).fill('#f3f3f3').stroke(black_line);
    tilePositions.forEach((tpData) => face.add(createTilePosition(fCenter, tpData, fScale * tpScale)));
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
