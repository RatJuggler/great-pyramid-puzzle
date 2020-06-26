// import { dumpPuzzles } from "./puzzle-console-dump";
import { SVG } from "@svgdotjs/svg.js";

// dumpPuzzles();

const canvas = SVG().addTo("body").size("100%", "100%").viewbox("-200 -200 400 400");
const face1_center = canvas.circle(1);
const face1 = canvas.path('M  73.9224 -42.6791 L -73.9224  -42.6791 L    0       85.3583 L  73.9224 -42.6791 Z');
const face2_center = canvas.circle(1).move(0, -89.6262);
const face2 = canvas.path('M  73.9224 -46.947  L   0      -174.984  L  -73.9224 -46.947  L  73.9224 -46.947  Z');
const face3_center = canvas.circle(1).move(78.1903, 44.8131);
const face3 = canvas.path('M 152.113   87.4922 L  78.1903  -40.5452 L    4.2679  87.4922 L 152.113   87.4922 Z');
const face4_center = canvas.circle(1).move(-78.1903, 44.8131);
const face4 = canvas.path('M  -4.2679  87.4922 L -78.1903  -40.5452 L -152.113   87.4922 L  -4.2679  87.4922 Z');
const tetrahedron = canvas.group();
tetrahedron.add(face1_center);
tetrahedron.add(face1);
tetrahedron.add(face2_center);
tetrahedron.add(face2);
tetrahedron.add(face3_center);
tetrahedron.add(face3);
tetrahedron.add(face4_center);
tetrahedron.add(face4);
tetrahedron.fill('none').stroke({width: 1, color: '#000'});
