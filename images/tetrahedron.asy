// Drawing file for asymptote (https://asymptote.sourceforge.io/).

// Settings for svg output (can also use pdf).
settings.libgs="";
settings.outformat="pdf";

import geometry;

// Size
size(10cm, 0);
real face_gap = 0.05;
real tile_gap = 0.05;

// Origin
point origin = (0, 0);
dot(origin);

// Tetrahedron triangle face forms
path face_a = polygon(3);
path face_b = shift(0, -point(face_a, 1).y - face_gap) * rotate(60) * polygon(3);
path face_c = shift(point(face_a, 0).x + face_gap, point(face_a, 0).y - point(face_a, 1).y - (face_gap * 1.5)) * polygon(3);
path face_d = shift(-point(face_a, 0).x - face_gap, point(face_a, 0).y - point(face_a, 1).y - (face_gap * 1.5)) * polygon(3);

draw(face_a);
draw(face_b);
draw(face_c);
draw(face_d);

// Face A tiles
real face_side = length(point(face_a, 0)--point(face_a, 1));
real tile_scale = ((face_side - (tile_gap * 3)) / 2) / face_side;
write(1 / (face_side / ((face_side - (tile_gap * 3)) / 2)));
path tile_a2 = scale(tile_scale) * rotate(60) * polygon(3);
path tile_a1 = shift(0, -point(tile_a2, 2).y + tile_gap) * scale(tile_scale) * polygon(3);
path tile_a3 = shift(point(tile_a1, 0).x + tile_gap, -point(tile_a2, 1).y - (tile_gap * 0.5)) * scale(tile_scale) * polygon(3);
path tile_a4 = shift(-point(tile_a1, 0).x - tile_gap, -point(tile_a2, 1).y - (tile_gap * 0.5)) * scale(tile_scale) * polygon(3);

draw(tile_a1);
draw(tile_a2);
draw(tile_a3);
draw(tile_a4);
