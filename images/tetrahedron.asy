// Drawing file for asymptote (https://asymptote.sourceforge.io/).

// Settings for svg output (can also use pdf).
settings.libgs="";
settings.outformat="pdf";

import geometry;

// Size
size(10cm, 0);
real face_gap = 0.05;
real tile_gap = 0.05;

// Tetrahedron triangle face forms
point face_a_center = (0, 0);
path face_a = polygon(3);
point face_b_center = (0, -point(face_a, 1).y - face_gap);
path face_b = shift(face_b_center) * rotate(60) * polygon(3);
point face_c_center = (point(face_a, 0).x + face_gap, point(face_a, 0).y - point(face_a, 1).y - (face_gap * 1.5));
path face_c = shift(face_c_center) * polygon(3);
point face_d_center = (-point(face_a, 0).x - face_gap, point(face_a, 0).y - point(face_a, 1).y - (face_gap * 1.5));
path face_d = shift(face_d_center) * polygon(3);

dot(face_a_center);
draw(face_a);
dot(face_b_center);
draw(face_b);
dot(face_c_center);
draw(face_c);
dot(face_d_center);
draw(face_d);

// Fit tiles onto a face
real face_side = length(point(face_a, 0)--point(face_a, 1));
real tile_scale = ((face_side - (tile_gap * 3)) / 2) / face_side;

// Face A tiles
path tile_a1 = shift(face_a_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_a2 = shift(0, 0) * shift(face_a_center) * scale(tile_scale) * polygon(3);
path tile_a3 = shift(0, 0) * shift(face_a_center) * scale(tile_scale) * polygon(3);
path tile_a4 = shift(0, 0) * shift(face_a_center) * scale(tile_scale) * polygon(3);

draw(tile_a1);
draw(tile_a2);
draw(tile_a3);
draw(tile_a4);

// Face B tiles
path tile_b1 = shift(face_b_center) * scale(tile_scale) * polygon(3);
path tile_b2 = shift(0, 0) * shift(face_b_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_b3 = shift(0, 0) * shift(face_b_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_b4 = shift(0, 0) * shift(face_b_center) * scale(tile_scale) * rotate(60) * polygon(3);

draw(tile_b1);
draw(tile_b2);
draw(tile_b3);
draw(tile_b4);

// Face C tiles
path tile_c1 = shift(face_c_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_c2 = shift(0, 0) * shift(face_c_center) * scale(tile_scale) * polygon(3);
path tile_c3 = shift(0, 0) * shift(face_c_center) * scale(tile_scale) * polygon(3);
path tile_c4 = shift(0, 0) * shift(face_c_center) * scale(tile_scale) * polygon(3);

draw(tile_c1);
draw(tile_c2);
draw(tile_c3);
draw(tile_c4);

// Face D tiles
path tile_d1 = shift(face_d_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_d2 = shift(0, 0) * shift(face_d_center) * scale(tile_scale) * polygon(3);
path tile_d3 = shift(0, 0) * shift(face_d_center) * scale(tile_scale) * polygon(3);
path tile_d4 = shift(0, 0) * shift(face_d_center) * scale(tile_scale) * polygon(3);

draw(tile_d1);
draw(tile_d2);
draw(tile_d3);
draw(tile_d4);
