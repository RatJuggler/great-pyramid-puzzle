// Drawing file for asymptote (https://asymptote.sourceforge.io/).

// Settings for svg output (can also use pdf).
settings.libgs="";
settings.outformat="pdf";

import geometry;

// Size and formatting
size(10cm);
unitsize(3cm);
real face_gap = 0.05;
real tile_gap = 0.025;
pen tile_label = fontsize(6pt);
pen note_label = fontsize(8pt);
pen face_colour = palegray;
pen tile_colour = lightgray;


// Tetrahedron triangle faces, outward facing surfaces will be shown so would fold down
point face_a_center = (0, 0);
path face_a = rotate(60) * polygon(3);
point face_b_center = (0, -point(face_a, 2).y + face_gap);
path face_b = shift(face_b_center) * polygon(3);
point face_c_center = (point(face_a, 0).x + face_gap, -point(face_a, 1).y - (face_gap * 0.5));
path face_c = shift(face_c_center) * polygon(3);
point face_d_center = (-point(face_a, 0).x - face_gap, -point(face_a, 1).y - (face_gap * 0.5));
path face_d = shift(face_d_center) * polygon(3);

filldraw(face_a, face_colour);
filldraw(face_b, face_colour);
filldraw(face_c, face_colour);
filldraw(face_d, face_colour);

// Fit tiles onto a face
real face_side = length(point(face_a, 0)--point(face_a, 1));
real tile_scale = ((face_side - (tile_gap * 4)) / 3) / face_side;
path reference_tile = scale(tile_scale) * polygon(3);
// Reference tile is centered on origin.
real tile_offset_x = point(reference_tile, 0).x + (tile_gap / 2);
real tile_offset_y = -point(reference_tile, 0).y + (tile_gap / 2);
real tile_offset_y2 = -point(reference_tile, 0).y * 2 + (tile_gap / 2);

// Face A tiles
path tile_a1 = shift(tile_offset_x, tile_offset_y) * shift(face_a_center) * scale(tile_scale) * polygon(3);
path tile_a2 = shift(tile_offset_x * 2, tile_offset_y2) * shift(face_a_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_a3 = shift(tile_offset_x, tile_offset_y - tile_offset_y2) * shift(face_a_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_a4 = shift(0, -tile_offset_y2 * 2) * shift(face_a_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_a5 = shift(0, -tile_offset_y2) * shift(face_a_center) * scale(tile_scale) * polygon(3);
path tile_a6 = shift(-tile_offset_x, tile_offset_y - tile_offset_y2) * shift(face_a_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_a7 = shift(-tile_offset_x, tile_offset_y) * shift(face_a_center) * scale(tile_scale) * polygon(3);
path tile_a8 = shift(-tile_offset_x * 2, tile_offset_y2) * shift(face_a_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_a9 = shift(0, tile_offset_y2) * shift(face_a_center) * scale(tile_scale) * rotate(60) * polygon(3);

filldraw(tile_a1, tile_colour);
label("TP-A1", tile_a1, SE, tile_label);
filldraw(tile_a2, tile_colour);
label("TP-A2", tile_a2, NE, tile_label);
filldraw(tile_a3, tile_colour);
label("TP-A3", tile_a3, NE, tile_label);
filldraw(tile_a4, tile_colour);
label("TP-A4", tile_a4, NE, tile_label);
filldraw(tile_a5, tile_colour);
label("TP-A5", tile_a5, SE, tile_label);
filldraw(tile_a6, tile_colour);
label("TP-A6", tile_a6, NE, tile_label);
filldraw(tile_a7, tile_colour);
label("TP-A7", tile_a7, SE, tile_label);
filldraw(tile_a8, tile_colour);
label("TP-A8", tile_a8, NE, tile_label);
filldraw(tile_a9, tile_colour);
label("TP-A9", tile_a9, NE, tile_label);

// Face B tiles
path tile_b1 = shift(0, tile_offset_y2) * shift(face_b_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_b2 = shift(0, tile_offset_y2 * 2) * shift(face_b_center) * scale(tile_scale) * polygon(3);
path tile_b3 = shift(tile_offset_x, tile_offset_y) * shift(face_b_center) * scale(tile_scale) * polygon(3);
path tile_b4 = shift(tile_offset_x * 2, -tile_offset_y2) * shift(face_b_center) * scale(tile_scale) * polygon(3);
path tile_b5 = shift(tile_offset_x, -tile_offset_y) * shift(face_b_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_b6 = shift(0, -tile_offset_y2) * shift(face_b_center) * scale(tile_scale) * polygon(3);
path tile_b7 = shift(-tile_offset_x, -tile_offset_y) * shift(face_b_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_b8 = shift(-tile_offset_x * 2, -tile_offset_y2) * shift(face_b_center) * scale(tile_scale) * polygon(3);
path tile_b9 = shift(-tile_offset_x, tile_offset_y) * shift(face_b_center) * scale(tile_scale) * polygon(3);

filldraw(tile_b1, tile_colour);
label("TP-B1", tile_b1, NE, tile_label);
filldraw(tile_b2, tile_colour);
label("TP-B2", tile_b2, SE, tile_label);
filldraw(tile_b3, tile_colour);
label("TP-B3", tile_b3, SE, tile_label);
filldraw(tile_b4, tile_colour);
label("TP-B4", tile_b4, SE, tile_label);
filldraw(tile_b5, tile_colour);
label("TP-B5", tile_b5, NE, tile_label);
filldraw(tile_b6, tile_colour);
label("TP-B6", tile_b6, SE, tile_label);
filldraw(tile_b7, tile_colour);
label("TP-B7", tile_b7, NE, tile_label);
filldraw(tile_b8, tile_colour);
label("TP-B8", tile_b8, SE, tile_label);
filldraw(tile_b9, tile_colour);
label("TP-B9", tile_b9, SE, tile_label);

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
