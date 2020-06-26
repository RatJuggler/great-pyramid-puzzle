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

// 0.393060796608386       0.2375  0.45

const tetrahedronPocket = [
    {
        name: 1,
        center: {x: 0, y: 0, r: 60, s: 1},
        tilePositions: [
            {x: 0, y: 0, r: 60, s: 0.425},
            {x: 0, y: 0, r: 60, s: 0.425},
            {x: 0, y: 0, r: 0, s: 0.425},
            {x: 0, y: 0, r: 60, s: 0.425}
        ]
    },
    {
        name: 2,
        center: {x: 0, y: -29.8754, r: 0, s: 1},
        tilePositions: [
            {x: 0, y: 0, r: 0, s: 0.425},
            {x: 0, y: 0, r: 0, s: 0.425},
            {x: 0, y: 0, r: 60, s: 0.425},
            {x: 0, y: 0, r: 0, s: 0.425}
        ]
    },
    {
        name: 3,
        center: {x: 26.0634, y: 14.9377, r: 0, s: 1},
        tilePositions: [
            {x: 0, y: 0, r: 0, s: 0.425},
            {x: 0, y: 0, r: 0, s: 0.425},
            {x: 0, y: 0, r: 60, s: 0.425},
            {x: 0, y: 0, r: 0, s: 0.425}
        ]
    },
    {
        name: 4,
        center: {x: -26.0634, y: 14.9377, r: 0, s: 1},
        tilePositions: [
            {x: 0, y: 0, r: 0, s: 0.425},
            {x: 0, y: 0, r: 0, s: 0.425},
            {x: 0, y: 0, r: 60, s: 0.425},
            {x: 0, y: 0, r: 0, s: 0.425}
        ]
    }
]

function drawTilePosition(fCenter: CenterPoint, tpCenter: CenterPoint) {
    const tTilePosition = new Matrix(fCenter.s * tpCenter.s, 0, 0, fCenter.s * tpCenter.s, fCenter.x + tpCenter.x, fCenter.y + tpCenter.y);
    const tilePosition = canvas.path(unit_triangle).transform(tTilePosition).rotate(tpCenter.r, fCenter.x + tpCenter.x, fCenter.y + tpCenter.y);
    tilePosition.fill('#e6e6e6').stroke(black_line);
}

function drawFace(faceData: {center: CenterPoint, tilePositions: CenterPoint[]}) {
    const fScale = faceData.center.s * 3;
    const fCenter = {x: faceData.center.x * fScale, y: faceData.center.y * fScale, r: faceData.center.r, s: fScale};
    const tFace = new Matrix(fScale, 0, 0, fScale, fCenter.x, fCenter.y);
    const face = canvas.path(unit_triangle).transform(tFace).rotate(faceData.center.r, fCenter.x, fCenter.y);
    faceData.tilePositions.forEach((tpCenter) => drawTilePosition(fCenter, tpCenter));
    face.fill('#f3f3f3').stroke(black_line);
    canvas.circle(1).translate(fCenter.x, fCenter.y).fill('#000').stroke(black_line);
}

const canvas = SVG().addTo("body").size("100%", "100%").viewbox("-200 -200 400 400");

// tetrahedronTest.forEach((face) => drawFace(face));
tetrahedronPocket.forEach((face) => drawFace(face));
