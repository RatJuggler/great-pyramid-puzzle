// Drawing file for asymptote (https://asymptote.sourceforge.io/).

// Settings for svg output (can also use pdf).
settings.libgs="";
settings.outformat="svg";

import geometry;

// Size and formatting
size(10cm);
unitsize(3cm);
real face_gap = 0.05;
real tile_gap = 0.05;
transform label_up = shift(0, 0.05);
transform label_down = shift(0, -0.05);
pen tile_label = fontsize(2pt);
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
label("TP-A1", label_down * tile_a1, SE, tile_label);
filldraw(tile_a2, tile_colour);
label("TP-A2", label_up * tile_a2, NE, tile_label);
filldraw(tile_a3, tile_colour);
label("TP-A3", label_up * tile_a3, NE, tile_label);
filldraw(tile_a4, tile_colour);
label("TP-A4", label_up * tile_a4, NE, tile_label);
filldraw(tile_a5, tile_colour);
label("TP-A5", label_down * tile_a5, SE, tile_label);
filldraw(tile_a6, tile_colour);
label("TP-A6", label_up * tile_a6, NE, tile_label);
filldraw(tile_a7, tile_colour);
label("TP-A7", label_down * tile_a7, SE, tile_label);
filldraw(tile_a8, tile_colour);
label("TP-A8", label_up * tile_a8, NE, tile_label);
filldraw(tile_a9, tile_colour);
label("TP-A9", label_up * tile_a9, NE, tile_label);

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
label("TP-B1", label_up * tile_b1, NE, tile_label);
filldraw(tile_b2, tile_colour);
label("TP-B2", label_down * tile_b2, SE, tile_label);
filldraw(tile_b3, tile_colour);
label("TP-B3", label_down * tile_b3, SE, tile_label);
filldraw(tile_b4, tile_colour);
label("TP-B4", label_down * tile_b4, SE, tile_label);
filldraw(tile_b5, tile_colour);
label("TP-B5", label_up * tile_b5, NE, tile_label);
filldraw(tile_b6, tile_colour);
label("TP-B6", label_down * tile_b6, SE, tile_label);
filldraw(tile_b7, tile_colour);
label("TP-B7", label_up * tile_b7, NE, tile_label);
filldraw(tile_b8, tile_colour);
label("TP-B8", label_down * tile_b8, SE, tile_label);
filldraw(tile_b9, tile_colour);
label("TP-B9", label_down * tile_b9, SE, tile_label);

// Face C tiles
path tile_c1 = shift(tile_offset_x, -tile_offset_y) * shift(face_c_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_c2 = shift(tile_offset_x * 2, -tile_offset_y2) * shift(face_c_center) * scale(tile_scale) * polygon(3);
path tile_c3 = shift(0, -tile_offset_y2) * shift(face_c_center) * scale(tile_scale) * polygon(3);
path tile_c4 = shift(-tile_offset_x * 2, -tile_offset_y2) * shift(face_c_center) * scale(tile_scale) * polygon(3);
path tile_c5 = shift(-tile_offset_x, -tile_offset_y) * shift(face_c_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_c6 = shift(-tile_offset_x, tile_offset_y) * shift(face_c_center) * scale(tile_scale) * polygon(3);
path tile_c7 = shift(0, tile_offset_y2) * shift(face_c_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_c8 = shift(0, tile_offset_y2 * 2) * shift(face_c_center) * scale(tile_scale) * polygon(3);
path tile_c9 = shift(tile_offset_x, tile_offset_y) * shift(face_c_center) * scale(tile_scale) * polygon(3);

filldraw(tile_c1, tile_colour);
label("TP-C1", label_up * tile_c1, NE, tile_label);
filldraw(tile_c2, tile_colour);
label("TP-C2", label_down * tile_c2, SE, tile_label);
filldraw(tile_c3, tile_colour);
label("TP-C3", label_down * tile_c3, SE, tile_label);
filldraw(tile_c4, tile_colour);
label("TP-C4", label_down * tile_c4, SE, tile_label);
filldraw(tile_c5, tile_colour);
label("TP-C5", label_up * tile_c5, NE, tile_label);
filldraw(tile_c6, tile_colour);
label("TP-C6", label_down * tile_c6, SE, tile_label);
filldraw(tile_c7, tile_colour);
label("TP-C7", label_up * tile_c7, NE, tile_label);
filldraw(tile_c8, tile_colour);
label("TP-C8", label_down * tile_c8, SE, tile_label);
filldraw(tile_c9, tile_colour);
label("TP-C9", label_down * tile_c9, SE, tile_label);

// Face D tiles
path tile_d1 = shift(-tile_offset_x, -tile_offset_y) * shift(face_d_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_d2 = shift(-tile_offset_x * 2, -tile_offset_y2) * shift(face_d_center) * scale(tile_scale) * polygon(3);
path tile_d3 = shift(-tile_offset_x, tile_offset_y) * shift(face_d_center) * scale(tile_scale) * polygon(3);
path tile_d4 = shift(0, tile_offset_y2 * 2) * shift(face_d_center) * scale(tile_scale) * polygon(3);
path tile_d5 = shift(0, tile_offset_y2) * shift(face_d_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_d6 = shift(tile_offset_x, tile_offset_y) * shift(face_d_center) * scale(tile_scale) * polygon(3);
path tile_d7 = shift(tile_offset_x, -tile_offset_y) * shift(face_d_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_d8 = shift(tile_offset_x * 2, -tile_offset_y2) * shift(face_d_center) * scale(tile_scale) * polygon(3);
path tile_d9 = shift(0, -tile_offset_y2) * shift(face_d_center) * scale(tile_scale) * polygon(3);

filldraw(tile_d1, tile_colour);
label("TP-D1", label_up * tile_d1, NE, tile_label);
filldraw(tile_d2, tile_colour);
label("TP-D2", label_down * tile_d2, SE, tile_label);
filldraw(tile_d3, tile_colour);
label("TP-D3", label_down * tile_d3, SE, tile_label);
filldraw(tile_d4, tile_colour);
label("TP-D4", label_down * tile_d4, SE, tile_label);
filldraw(tile_d5, tile_colour);
label("TP-D5", label_up * tile_d5, NE, tile_label);
filldraw(tile_d6, tile_colour);
label("TP-D6", label_down * tile_d6, SE, tile_label);
filldraw(tile_d7, tile_colour);
label("TP-D7", label_up * tile_d7, NE, tile_label);
filldraw(tile_d8, tile_colour);
label("TP-D8", label_down * tile_d8, SE, tile_label);
filldraw(tile_d9, tile_colour);
label("TP-D9", label_down * tile_d9, SE, tile_label);

label("*Outward facing surfaces shown.", (point(face_d, 2).x, point(face_b, 1).y), E, note_label);
label("*TP = Tile Position", (point(face_d, 2).x, point(face_b, 1).y - 0.125), E, note_label);
