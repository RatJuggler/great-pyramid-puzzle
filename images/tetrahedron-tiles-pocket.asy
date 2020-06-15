// Drawing file for asymptote (https://asymptote.sourceforge.io/).

// Settings for svg output (can also use pdf).
settings.libgs="";
settings.outformat="svg";

import geometry;

// Size and formatting
size(10cm, 0);
real face_gap = 0.05;
real tile_gap = 0.05;
pen tile_label = fontsize(8pt);
pen note_label = fontsize(8pt);

// Tetrahedron triangle faces, outward facing surfaces will be shown so would fold down
point face_a_center = (0, 0);
path face_a = rotate(60) * polygon(3);
point face_b_center = (0, -point(face_a, 2).y + face_gap);
path face_b = shift(face_b_center) * polygon(3);
point face_c_center = (point(face_a, 0).x + face_gap, -point(face_a, 1).y - (face_gap * 0.5));
path face_c = shift(face_c_center) * polygon(3);
point face_d_center = (-point(face_a, 0).x - face_gap, -point(face_a, 1).y - (face_gap * 0.5));
path face_d = shift(face_d_center) * polygon(3);

draw(face_a);
draw(face_b);
draw(face_c);
draw(face_d);

// Fit tiles onto a face
real face_side = length(point(face_a, 0)--point(face_a, 1));
real tile_scale = ((face_side - (tile_gap * 3)) / 2) / face_side;

// Face A tiles
path tile_a1 = shift(face_a_center) * scale(tile_scale) * polygon(3);
path tile_a2 = shift(0, -(point(tile_a1, 1).y - face_a_center.y) - tile_gap) * shift(face_a_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_a4 = shift((point(tile_a1, 0).x - face_a_center.x) + tile_gap, -point(tile_a1, 0).y + (tile_gap * 0.5)) * shift(face_a_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_a3 = shift(-(point(tile_a1, 0).x - face_a_center.x) - tile_gap, -point(tile_a1, 0).y + (tile_gap * 0.5)) * shift(face_a_center) * scale(tile_scale) * rotate(60) * polygon(3);

draw(Label("TP-A1"), tile_a1, SE, tile_label);
draw(Label("TP-A2"), tile_a2, NE, tile_label);
draw(Label("TP-A3"), tile_a3, NE, tile_label);
draw(Label("TP-A4"), tile_a4, NE, tile_label);

// Face B tiles
path tile_b1 = shift(face_b_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_b2 = shift(0, face_b_center.y - point(tile_b1, 2).y + tile_gap) * shift(face_b_center) * scale(tile_scale) * polygon(3);
path tile_b3 = shift((point(tile_b1, 0).x - face_a_center.x) + tile_gap, -(point(tile_b1, 0).y - face_b_center.y) - (tile_gap * 0.5)) * shift(face_b_center) * scale(tile_scale) * polygon(3);
path tile_b4 = shift(-(point(tile_b1, 0).x - face_a_center.x) - tile_gap, -(point(tile_b1, 0).y - face_b_center.y) - (tile_gap * 0.5)) * shift(face_b_center) * scale(tile_scale) * polygon(3);

draw(Label("TP-B1"), tile_b1, NE, tile_label);
draw(Label("TP-B2"), tile_b2, SE, tile_label);
draw(Label("TP-B3"), tile_b3, SE, tile_label);
draw(Label("TP-B4"), tile_b4, SE, tile_label);

// Face C tiles
path tile_c1 = shift(face_c_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_c4 = shift(0, face_c_center.y - point(tile_c1, 2).y + tile_gap) * shift(face_c_center) * scale(tile_scale) * polygon(3);
path tile_c2 = shift((point(tile_c1, 0).x - face_c_center.x) + tile_gap, -(point(tile_c1, 1).y - face_c_center.y) - (tile_gap * 0.5)) * shift(face_c_center) * scale(tile_scale) * polygon(3);
path tile_c3 = shift(-(point(tile_c1, 0).x - face_c_center.x) - tile_gap, -(point(tile_c1, 1).y - face_c_center.y) - (tile_gap * 0.5)) * shift(face_c_center) * scale(tile_scale) * polygon(3);

draw(Label("TP-C1"), tile_c1, NE, tile_label);
draw(Label("TP-C2"), tile_c2, SE, tile_label);
draw(Label("TP-C3"), tile_c3, SE, tile_label);
draw(Label("TP-C4"), tile_c4, SE, tile_label);

// Face D tiles
path tile_d1 = shift(face_d_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_d3 = shift(0, face_d_center.y - point(tile_d1, 2).y + tile_gap) * shift(face_d_center) * scale(tile_scale) * polygon(3);
path tile_d4 = shift((point(tile_d1, 0).x - face_d_center.x) + tile_gap, -(point(tile_d1, 1).y - face_d_center.y) - (tile_gap * 0.5)) * shift(face_d_center) * scale(tile_scale) * polygon(3);
path tile_d2 = shift(-(point(tile_d1, 0).x - face_d_center.x) - tile_gap, -(point(tile_d1, 1).y - face_d_center.y) - (tile_gap * 0.5)) * shift(face_d_center) * scale(tile_scale) * polygon(3);

draw(Label("TP-D1"), tile_d1, NE, tile_label);
draw(Label("TP-D2"), tile_d2, SE, tile_label);
draw(Label("TP-D3"), tile_d3, SE, tile_label);
draw(Label("TP-D4"), tile_d4, SE, tile_label);

label("*Outward facing surfaces shown.", (point(face_d, 2).x, point(face_b, 1).y), E, note_label);
label("*TP = Tile Position", (point(face_d, 2).x, point(face_b, 1).y - 0.125), E, note_label);
