// Drawing file for asymptote (https://asymptote.sourceforge.io/).

// Settings for svg output (can also use pdf).
settings.libgs="";
settings.outformat="pdf";

import geometry;

// Size and formatting
size(10cm, 0);
real face_gap = 0.05;
real tile_gap = 0.05;

// Tetrahedron triangle faces, outward facing surfaces will be shown so would fold down
point face_a_center = (0, 0);
path face_a = rotate(60) * polygon(3);
point face_b_center = (0, -point(face_a, 2).y + face_gap);
path face_b = shift(face_b_center) * polygon(3);
point face_c_center = (point(face_a, 0).x + face_gap, point(face_a, 2).y + point(face_a, 1).y - (face_gap * 0.5));
path face_c = shift(face_c_center) * polygon(3);
point face_d_center = (-point(face_a, 0).x - face_gap, point(face_a, 2).y + point(face_a, 1).y - (face_gap * 0.5));
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
path tile_a1 = shift(face_a_center) * scale(tile_scale) * polygon(3);
path tile_a2 = shift(0, point(tile_a1, 2).y - tile_gap) * shift(face_a_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_a3 = shift((point(tile_a2, 0).x - face_a_center.x) + tile_gap, -(point(tile_a1, 1).y - face_a_center.y) - (tile_gap * 0.5)) * shift(face_a_center) * scale(tile_scale) * polygon(3);
path tile_a4 = shift(-(point(tile_a2, 0).x - face_a_center.x) - tile_gap, -(point(tile_a1, 1).y - face_a_center.y) - (tile_gap * 0.5)) * shift(face_a_center) * scale(tile_scale) * polygon(3);

draw(tile_a1);
//draw(tile_a2);
//draw(tile_a3);
//draw(tile_a4);

// Face B tiles
path tile_b1 = shift(face_b_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_b2 = shift(face_b_center) * scale(tile_scale) * polygon(3);
tile_b2 = shift(0, (point(tile_b2, 2).y - face_b_center.y) - tile_gap) * tile_b2;
path tile_b3 = shift((point(tile_b1, 0).x - face_a_center.x) + tile_gap, -(point(tile_b1, 2).y - face_b_center.y) + (tile_gap * 0.5)) * shift(face_b_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_b4 = shift(-(point(tile_b1, 0).x - face_a_center.x) - tile_gap, -(point(tile_b1, 2).y - face_b_center.y) + (tile_gap * 0.5)) * shift(face_b_center) * scale(tile_scale) * rotate(60) * polygon(3);

draw(tile_b1);
//draw(tile_b2);
//draw(tile_b3);
//draw(tile_b4);

// Face C tiles
path tile_c1 = shift(face_c_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_c2 = shift(0, -(point(tile_c1, 2).y - face_c_center.y) + tile_gap) * shift(face_c_center) * scale(tile_scale) * polygon(3);
path tile_c3 = shift((point(tile_c2, 0).x - face_c_center.x) + tile_gap, -(point(tile_c1, 1).y - face_c_center.y) - (tile_gap * 0.5)) * shift(face_c_center) * scale(tile_scale) * polygon(3);
path tile_c4 = shift(-(point(tile_c2, 0).x - face_c_center.x) - tile_gap, -(point(tile_c1, 1).y - face_c_center.y) - (tile_gap * 0.5)) * shift(face_c_center) * scale(tile_scale) * polygon(3);

draw(tile_c1);
//draw(tile_c2);
//draw(tile_c3);
//draw(tile_c4);

// Face D tiles
path tile_d1 = shift(face_d_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_d2 = shift(0, -(point(tile_d1, 2).y - face_d_center.y) + tile_gap) * shift(face_d_center) * scale(tile_scale) * polygon(3);
path tile_d3 = shift((point(tile_d2, 0).x - face_d_center.x) + tile_gap, -(point(tile_d1, 1).y - face_d_center.y) - (tile_gap * 0.5)) * shift(face_d_center) * scale(tile_scale) * polygon(3);
path tile_d4 = shift(-(point(tile_d2, 0).x - face_d_center.x) - tile_gap, -(point(tile_d1, 1).y - face_d_center.y) - (tile_gap * 0.5)) * shift(face_d_center) * scale(tile_scale) * polygon(3);

draw(tile_d1);
//draw(tile_d2);
//draw(tile_d3);
//draw(tile_d4);
