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
transform label_right = shift(0.01, 0);
pen tile_label = fontsize(10pt);
pen note_label = fontsize(8pt);
pen face_colour = palegray;
pen tile_colour = lightgray;
pen title_label = fontsize(14pt);


// Tetrahedron triangle faces, outward facing surfaces will be shown so would fold down
point face_1_center = (0, 0);
path face_1 = rotate(60) * polygon(3);
point face_2_center = (0, -point(face_1, 2).y + face_gap);
path face_2 = shift(face_2_center) * polygon(3);
point face_3_center = (point(face_1, 0).x + face_gap, -point(face_1, 1).y - (face_gap * 0.5));
path face_3 = shift(face_3_center) * polygon(3);
point face_4_center = (-point(face_1, 0).x - face_gap, -point(face_1, 1).y - (face_gap * 0.5));
path face_4 = shift(face_4_center) * polygon(3);

filldraw(face_1, face_colour);
filldraw(face_2, face_colour);
filldraw(face_3, face_colour);
filldraw(face_4, face_colour);

// Fit tiles onto a face
real face_side = length(point(face_1, 0)--point(face_1, 1));
real tile_scale = ((face_side - (tile_gap * 4)) / 3) / face_side;
path reference_tile = scale(tile_scale) * polygon(3);
// Reference tile is centered on origin.
real tile_offset_x = point(reference_tile, 0).x + (tile_gap / 2);
real tile_offset_y = -point(reference_tile, 0).y + (tile_gap / 2);
real tile_offset_y2 = -point(reference_tile, 0).y * 2 + (tile_gap / 2);

// Face A tiles
path tile_1_1 = shift(tile_offset_x * 2, tile_offset_y2) * shift(face_1_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_1_2 = shift(0, tile_offset_y2) * shift(face_1_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_1_3 = shift(tile_offset_x, tile_offset_y) * shift(face_1_center) * scale(tile_scale) * polygon(3);
path tile_1_4 = shift(tile_offset_x, tile_offset_y - tile_offset_y2) * shift(face_1_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_1_5 = shift(-tile_offset_x * 2, tile_offset_y2) * shift(face_1_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_1_6 = shift(-tile_offset_x, tile_offset_y) * shift(face_1_center) * scale(tile_scale) * polygon(3);
path tile_1_7 = shift(-tile_offset_x, tile_offset_y - tile_offset_y2) * shift(face_1_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_1_8 = shift(0, -tile_offset_y2) * shift(face_1_center) * scale(tile_scale) * polygon(3);
path tile_1_9 = shift(0, -tile_offset_y2 * 2) * shift(face_1_center) * scale(tile_scale) * rotate(60) * polygon(3);

filldraw(tile_1_1, tile_colour);
label("1-1", label_right * tile_1_1, NE, tile_label);
filldraw(tile_1_2, tile_colour);
label("1-2", label_right * tile_1_2, NE, tile_label);
filldraw(tile_1_3, tile_colour);
label("1-3", label_right * tile_1_3, SE, tile_label);
filldraw(tile_1_4, tile_colour);
label("1-4", label_right * tile_1_4, NE, tile_label);
filldraw(tile_1_5, tile_colour);
label("1-5", label_right * tile_1_5, NE, tile_label);
filldraw(tile_1_6, tile_colour);
label("1-6", label_right * tile_1_6, SE, tile_label);
filldraw(tile_1_7, tile_colour);
label("1-7", label_right * tile_1_7, NE, tile_label);
filldraw(tile_1_8, tile_colour);
label("1-8", label_right * tile_1_8, SE, tile_label);
filldraw(tile_1_9, tile_colour);
label("1-9", label_right * tile_1_9, NE, tile_label);

// Face B tiles
path tile_2_1 = shift(0, tile_offset_y2 * 2) * shift(face_2_center) * scale(tile_scale) * polygon(3);
path tile_2_2 = shift(-tile_offset_x, tile_offset_y) * shift(face_2_center) * scale(tile_scale) * polygon(3);
path tile_2_3 = shift(0, tile_offset_y2) * shift(face_2_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_2_4 = shift(tile_offset_x, tile_offset_y) * shift(face_2_center) * scale(tile_scale) * polygon(3);
path tile_2_5 = shift(-tile_offset_x * 2, -tile_offset_y2) * shift(face_2_center) * scale(tile_scale) * polygon(3);
path tile_2_6 = shift(-tile_offset_x, -tile_offset_y) * shift(face_2_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_2_7 = shift(0, -tile_offset_y2) * shift(face_2_center) * scale(tile_scale) * polygon(3);
path tile_2_8 = shift(tile_offset_x, -tile_offset_y) * shift(face_2_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_2_9 = shift(tile_offset_x * 2, -tile_offset_y2) * shift(face_2_center) * scale(tile_scale) * polygon(3);

filldraw(tile_2_1, tile_colour);
label("2-1", label_right * tile_2_1, SE, tile_label);
filldraw(tile_2_2, tile_colour);
label("2-2", label_right * tile_2_2, SE, tile_label);
filldraw(tile_2_3, tile_colour);
label("2-3", label_right * tile_2_3, NE, tile_label);
filldraw(tile_2_4, tile_colour);
label("2-4", label_right * tile_2_4, SE, tile_label);
filldraw(tile_2_5, tile_colour);
label("2-5", label_right * tile_2_5, SE, tile_label);
filldraw(tile_2_6, tile_colour);
label("2-6", label_right * tile_2_6, NE, tile_label);
filldraw(tile_2_7, tile_colour);
label("2-7", label_right * tile_2_7, SE, tile_label);
filldraw(tile_2_8, tile_colour);
label("2-8", label_right * tile_2_8, NE, tile_label);
filldraw(tile_2_9, tile_colour);
label("2-9", label_right * tile_2_9, SE, tile_label);

// Face C tiles
path tile_3_1 = shift(tile_offset_x * 2, -tile_offset_y2) * shift(face_3_center) * scale(tile_scale) * polygon(3);
path tile_3_2 = shift(tile_offset_x, tile_offset_y) * shift(face_3_center) * scale(tile_scale) * polygon(3);
path tile_3_3 = shift(tile_offset_x, -tile_offset_y) * shift(face_3_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_3_4 = shift(0, -tile_offset_y2) * shift(face_3_center) * scale(tile_scale) * polygon(3);
path tile_3_5 = shift(0, tile_offset_y2 * 2) * shift(face_3_center) * scale(tile_scale) * polygon(3);
path tile_3_6 = shift(0, tile_offset_y2) * shift(face_3_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_3_7 = shift(-tile_offset_x, tile_offset_y) * shift(face_3_center) * scale(tile_scale) * polygon(3);
path tile_3_8 = shift(-tile_offset_x, -tile_offset_y) * shift(face_3_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_3_9 = shift(-tile_offset_x * 2, -tile_offset_y2) * shift(face_3_center) * scale(tile_scale) * polygon(3);

filldraw(tile_3_1, tile_colour);
label("3-1", label_right * tile_3_1, SE, tile_label);
filldraw(tile_3_2, tile_colour);
label("3-2", label_right * tile_3_2, SE, tile_label);
filldraw(tile_3_3, tile_colour);
label("3-3", label_right * tile_3_3, NE, tile_label);
filldraw(tile_3_4, tile_colour);
label("3-4", label_right * tile_3_4, SE, tile_label);
filldraw(tile_3_5, tile_colour);
label("3-5", label_right * tile_3_5, SE, tile_label);
filldraw(tile_3_6, tile_colour);
label("3-6", label_right * tile_3_6, NE, tile_label);
filldraw(tile_3_7, tile_colour);
label("3-7", label_right * tile_3_7, SE, tile_label);
filldraw(tile_3_8, tile_colour);
label("3-8", label_right * tile_3_8, NE, tile_label);
filldraw(tile_3_9, tile_colour);
label("3-9", label_right * tile_3_9, SE, tile_label);

// Face D tiles
path tile_4_1 = shift(-tile_offset_x * 2, -tile_offset_y2) * shift(face_4_center) * scale(tile_scale) * polygon(3);
path tile_4_2 = shift(0, -tile_offset_y2) * shift(face_4_center) * scale(tile_scale) * polygon(3);
path tile_4_3 = shift(-tile_offset_x, -tile_offset_y) * shift(face_4_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_4_4 = shift(-tile_offset_x, tile_offset_y) * shift(face_4_center) * scale(tile_scale) * polygon(3);
path tile_4_5 = shift(tile_offset_x * 2, -tile_offset_y2) * shift(face_4_center) * scale(tile_scale) * polygon(3);
path tile_4_6 = shift(tile_offset_x, -tile_offset_y) * shift(face_4_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_4_7 = shift(tile_offset_x, tile_offset_y) * shift(face_4_center) * scale(tile_scale) * polygon(3);
path tile_4_8 = shift(0, tile_offset_y2) * shift(face_4_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_4_9 = shift(0, tile_offset_y2 * 2) * shift(face_4_center) * scale(tile_scale) * polygon(3);

filldraw(tile_4_1, tile_colour);
label("4-1", label_right * tile_4_1, SE, tile_label);
filldraw(tile_4_2, tile_colour);
label("4-2", label_right * tile_4_2, SE, tile_label);
filldraw(tile_4_3, tile_colour);
label("4-3", label_right * tile_4_3, NE, tile_label);
filldraw(tile_4_4, tile_colour);
label("4-4", label_right * tile_4_4, SE, tile_label);
filldraw(tile_4_5, tile_colour);
label("4-5", label_right * tile_4_5, SE, tile_label);
filldraw(tile_4_6, tile_colour);
label("4-6", label_right * tile_4_6, NE, tile_label);
filldraw(tile_4_7, tile_colour);
label("4-7", label_right * tile_4_7, SE, tile_label);
filldraw(tile_4_8, tile_colour);
label("4-8", label_right * tile_4_8, NE, tile_label);
filldraw(tile_4_9, tile_colour);
label("4-9", label_right * tile_4_9, SE, tile_label);

label("*Outward facing surfaces shown.", (point(face_4, 2).x, point(face_2, 1).y), E, note_label);

// Title
label("Tile positions for the Great puzzle.", (0, point(face_1, 2).y - 0.4), N, title_label);
