// import { dumpPuzzles } from "./puzzle-console-dump";
import { SVG, Matrix } from "@svgdotjs/svg.js";

// dumpPuzzles();

const unit_triangle = 'M 24.6408 14.2264 L 0 -28.4528 L -24.6408 14.2264 L 24.6408 14.2264 Z';

const black_line = {width: 0.25, color: '#000'};

const tetrahedron = [
        {
            name: 1,
            center: {x: 0, y: 0},
            rotate: 60
        },
        {
            name: 2,
            center: {x: 0, y: -29.8754},
            rotate: 0
        },
        {
            name: 3,
            center: {x: 26.0634, y: 14.9377},
            rotate: 0
        },
        {
            name: 4,
            center: {x: -26.0634, y: 14.9377},
            rotate: 0
        }
    ]

function drawFace(center: {x: number, y: number}, rotate: number) {
    const sCenter = {x: center.x * 3, y: center.y * 3};
    const tFace = new Matrix(3, 0, 0, 3, sCenter.x, sCenter.y);
    const face = canvas.path(unit_triangle).transform(tFace).rotate(rotate, sCenter.x, sCenter.y);
    face.fill('#f3f3f3').stroke(black_line);
    const tTilePosition = new Matrix(2.8, 0, 0, 2.8, sCenter.x, sCenter.y);
    const tilePosition = canvas.path(unit_triangle).transform(tTilePosition).rotate(rotate, sCenter.x, sCenter.y);
    tilePosition.fill('#e6e6e6').stroke(black_line);
    canvas.circle(1).translate(sCenter.x, sCenter.y).fill('#000').stroke(black_line);
}

const canvas = SVG().addTo("body").size("100%", "100%").viewbox("-200 -200 400 400");

tetrahedron.forEach((face) => drawFace(face.center, face.rotate));
