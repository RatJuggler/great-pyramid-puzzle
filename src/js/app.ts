// import { dumpPuzzles } from "./puzzle-console-dump";
import { SVG } from "@svgdotjs/svg.js";

// dumpPuzzles();

const black_line = {width: 1, color: '#000'};

const canvas = SVG().addTo("body").size("100%", "100%").viewbox("-200 -200 400 400");

const face1 = canvas.path('M  73.9224 -42.6791 L -73.9224  -42.6791 L    0       85.3583 L  73.9224 -42.6791 Z');
const face2 = canvas.path('M  73.9224 -46.947  L   0      -174.984  L  -73.9224 -46.947  L  73.9224 -46.947  Z');
const face3 = canvas.path('M 152.113   87.4922 L  78.1903  -40.5452 L    4.2679  87.4922 L 152.113   87.4922 Z');
const face4 = canvas.path('M  -4.2679  87.4922 L -78.1903  -40.5452 L -152.113   87.4922 L  -4.2679  87.4922 Z');
face1.fill('#f3f3f3').stroke(black_line);
face2.fill('#f3f3f3').stroke(black_line);
face3.fill('#f3f3f3').stroke(black_line);
face4.fill('#f3f3f3').stroke(black_line);

const tile_1_1 = canvas.path("M  66.5302 -38.4112 L -66.5302  -38.4112 L    0       76.8224 L  66.5302 -38.4112 Z");
const tile_2_1 = canvas.path("M  66.5302 -51.215  L   0      -166.449  L  -66.5302 -51.215  L  66.5302 -51.215  Z");
const tile_3_1 = canvas.path("M 144.721   83.2243 L  78.1903  -32.0094 L   11.6602  83.2243 L 144.721   83.2243 Z");
const tile_4_1 = canvas.path("M -11.6602  83.2243 L -78.1903  -32.0094 L -144.721   83.2243 L -11.6602  83.2243 Z");
tile_1_1.fill('#e6e6e6').stroke(black_line);
tile_2_1.fill('#e6e6e6').stroke(black_line);
tile_3_1.fill('#e6e6e6').stroke(black_line);
tile_4_1.fill('#e6e6e6').stroke(black_line);

const face1_center = canvas.circle(1);
const face2_center = canvas.circle(1).move(0, -89.6262);
const face3_center = canvas.circle(1).move(78.1903, 44.8131);
const face4_center = canvas.circle(1).move(-78.1903, 44.8131);
face1_center.fill('#000').stroke(black_line);
face2_center.fill('#000').stroke(black_line);
face3_center.fill('#000').stroke(black_line);
face4_center.fill('#000').stroke(black_line);
