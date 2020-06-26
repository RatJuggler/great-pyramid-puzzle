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

const tetrahedron = {
    face1: {
        center: {x: 0, y: 0},
        face: "M  73.9224 -42.6791 L -73.9224  -42.6791 L    0       85.3583 L  73.9224 -42.6791 Z",
        tilePosition: "M  66.5302 -38.4112 L -66.5302  -38.4112 L    0       76.8224 L  66.5302 -38.4112 Z"
    },
    face2: {
        center: {x: 0, y: -89.6262},
        face: "M  73.9224 -46.947  L   0      -174.984  L  -73.9224 -46.947  L  73.9224 -46.947  Z",
        tilePosition: "M  66.5302 -51.215  L   0      -166.449  L  -66.5302 -51.215  L  66.5302 -51.215  Z"
    },
    face3: {
        center: {x: 78.1903, y: 44.8131},
        face: "M 152.113   87.4922 L  78.1903  -40.5452 L    4.2679  87.4922 L 152.113   87.4922 Z",
        tilePosition: "M 144.721   83.2243 L  78.1903  -32.0094 L   11.6602  83.2243 L 144.721   83.2243 Z"
    },
    face4: {
        center: {x: -78.1903, y: 44.8131},
        face: "M  -4.2679  87.4922 L -78.1903  -40.5452 L -152.113   87.4922 L  -4.2679  87.4922 Z",
        tilePosition: "M -11.6602  83.2243 L -78.1903  -32.0094 L -144.721   83.2243 L -11.6602  83.2243 Z"
    }
}

drawFace(tetrahedron.face1.center, tetrahedron.face1.face, tetrahedron.face1.tilePosition);
drawFace(tetrahedron.face2.center, tetrahedron.face2.face, tetrahedron.face2.tilePosition);
drawFace(tetrahedron.face3.center, tetrahedron.face3.face, tetrahedron.face3.tilePosition);
drawFace(tetrahedron.face4.center, tetrahedron.face4.face, tetrahedron.face4.tilePosition);
