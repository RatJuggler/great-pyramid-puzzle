// import { dumpPuzzles } from "./puzzle-console-dump";
import { SVG, Matrix } from "@svgdotjs/svg.js";

// dumpPuzzles();

const unit_triangle = 'M 24.6408 14.2264 L 0 -28.4528 L -24.6408 14.2264 L 24.6408 14.2264 Z';

const black_line = {width: 0.25, color: '#000'};

interface CenterPoint {
    readonly x: number,
    readonly y: number,
    readonly r: number,
    readonly s: number
}

const tetrahedronTest = [
        {
            name: 1,
            center: {x: 0, y: 0, r: 60, s: 1},
            tilePositions: [
                {x: 0, y: 0, r: 60, s: 0.9}
            ]
        },
        {
            name: 2,
            center: {x: 0, y: -29.8754, r: 0, s: 1},
            tilePositions: [
                {x: 0, y: 0, r: 0, s: 0.9}
            ]
        },
        {
            name: 3,
            center: {x: 26.0634, y: 14.9377, r: 0, s: 1},
            tilePositions: [
                {x: 0, y: 0, r: 0, s: 0.9}
            ]
        },
        {
            name: 4,
            center: {x: -26.0634, y: 14.9377, r: 0, s: 1},
            tilePositions: [
                {x: 0, y: 0, r: 0, s: 0.9}
            ]
        }
    ]

// 0.393061       0.2375  0.45

const tetrahedronPocket = [
    {
        name: 1,
        center: {x: 0, y: 0, r: 60, s: 1},
        tilePositions: [
            {x: 39.3061, y: -23.75, r: 60, s: 0.425},
            {x: -39.3061, y: -23.75, r: 60, s: 0.425},
            {x: 0, y: 0, r: 0, s: 0.425},
            {x: 0, y: 45, r: 60, s: 0.425}
        ]
    },
    {
        name: 2,
        center: {x: 0, y: -29.8754, r: 0, s: 1},
        tilePositions: [
            {x: 0, y: -45, r: 0, s: 0.425},
            {x: -39.3061, y: 23.75, r: 0, s: 0.425},
            {x: 0, y: 0, r: 60, s: 0.425},
            {x: 39.3061, y: 23.75, r: 0, s: 0.425}
        ]
    },
    {
        name: 3,
        center: {x: 26.0634, y: 14.9377, r: 0, s: 1},
        tilePositions: [
            {x: 0, y: -45, r: 0, s: 0.425},
            {x: -39.3061, y: 23.75, r: 0, s: 0.425},
            {x: 0, y: 0, r: 60, s: 0.425},
            {x: 39.3061, y: 23.75, r: 0, s: 0.425}
        ]
    },
    {
        name: 4,
        center: {x: -26.0634, y: 14.9377, r: 0, s: 1},
        tilePositions: [
            {x: 0, y: -45, r: 0, s: 0.425},
            {x: -39.3061, y: 23.75, r: 0, s: 0.425},
            {x: 0, y: 0, r: 60, s: 0.425},
            {x: 39.3061, y: 23.75, r: 0, s: 0.425}
        ]
    }
]

function drawTilePosition(fCenter: CenterPoint, tpData: CenterPoint) {
    const tpScale = tpData.s * fCenter.s;
    const tpCenter = {x: fCenter.x + tpData.x, y: fCenter.y + tpData.y, r: tpData.r, s: tpScale};
    const tTilePosition = new Matrix(tpScale, 0, 0, tpScale, tpCenter.x, tpCenter.y);
    const tilePosition = canvas.path(unit_triangle).transform(tTilePosition); //.rotate(tpCenter.r, tpCenter.x, tpCenter.y);
    tilePosition.fill('#e6e6e6').stroke(black_line);
}

function drawFace(fData: {center: CenterPoint, tilePositions: CenterPoint[]}) {
    const fScale = fData.center.s * 3;
    const fCenter = {x: fData.center.x * fScale, y: fData.center.y * fScale, r: fData.center.r, s: fScale};
    const tFace = new Matrix(fScale, 0, 0, fScale, fCenter.x, fCenter.y);
    const face = canvas.path(unit_triangle).transform(tFace).rotate(fData.center.r, fCenter.x, fCenter.y);
    fData.tilePositions.forEach((tpData) => drawTilePosition(fCenter, tpData));
    face.fill('#f3f3f3').stroke(black_line);
    canvas.circle(1).translate(fCenter.x, fCenter.y).fill('#000').stroke(black_line);
}

const canvas = SVG().addTo("body").size("100%", "100%").viewbox("-200 -200 400 400");

// tetrahedronTest.forEach((face) => drawFace(face));
tetrahedronPocket.forEach((face) => drawFace(face));
