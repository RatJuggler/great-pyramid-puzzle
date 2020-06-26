// import { dumpPuzzles } from "./puzzle-console-dump";
import { SVG } from "@svgdotjs/svg.js";

// dumpPuzzles();

const black_line = {width: 1, color: '#000'};

function drawFace(center: {x: number, y: number}, face: string, tilePosition: string) {
    canvas.path(face).fill('#f3f3f3').stroke(black_line);
    canvas.path(tilePosition).fill('#e6e6e6').stroke(black_line);
    canvas.circle(1).move(center.x, center.y).fill('#000').stroke(black_line);
}

const canvas = SVG().addTo("body").size("100%", "100%").viewbox("-200 -200 400 400");

const tetrahedron = [
        {
            name: 1,
            center: {x: 0, y: 0},
            face: "M  73.9224 -42.6791 L -73.9224  -42.6791 L    0       85.3583 L  73.9224 -42.6791 Z",
            tilePosition: "M  66.5302 -38.4112 L -66.5302  -38.4112 L    0       76.8224 L  66.5302 -38.4112 Z"
        },
        {
            name: 2,
            center: {x: 0, y: -89.6262},
            face: "M  73.9224 -46.947  L   0      -174.984  L  -73.9224 -46.947  L  73.9224 -46.947  Z",
            tilePosition: "M  66.5302 -51.215  L   0      -166.449  L  -66.5302 -51.215  L  66.5302 -51.215  Z"
        },
        {
            name: 3,
            center: {x: 78.1903, y: 44.8131},
            face: "M 152.113   87.4922 L  78.1903  -40.5452 L    4.2679  87.4922 L 152.113   87.4922 Z",
            tilePosition: "M 144.721   83.2243 L  78.1903  -32.0094 L   11.6602  83.2243 L 144.721   83.2243 Z"
        },
        {
            name: 4,
            center: {x: -78.1903, y: 44.8131},
            face: "M  -4.2679  87.4922 L -78.1903  -40.5452 L -152.113   87.4922 L  -4.2679  87.4922 Z",
            tilePosition: "M -11.6602  83.2243 L -78.1903  -32.0094 L -144.721   83.2243 L -11.6602  83.2243 Z"
        }
    ]

tetrahedron.forEach((face) => drawFace(face.center, face.face, face.tilePosition));
