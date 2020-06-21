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
pen tile_label = fontsize(12pt);
pen note_label = fontsize(8pt);
pen side_label = fontsize(6pt);
pen face_colour = palegray;
pen tile_colour = lightgray;
transform label_down_right = shift(0.05, -0.05);
transform label_up_right = shift(0.05, 0.05);
pen title_label = fontsize(14pt);


void tile_position_up(path tile_position, string id, string side1 = "A", string side2 = "B", string side3 = "C") {
    filldraw(tile_position, tile_colour);
    label(id, label_down_right * tile_position, SE, tile_label);
    label(side1, (point(tile_position, 1)--point(tile_position, 3)), SW, side_label);
    label(side2, (point(tile_position, 3)--point(tile_position, 2)), N, side_label);
    label(side3, (point(tile_position, 2)--point(tile_position, 1)), SE, side_label);
}

void tile_position_down(path tile_position, string id, string side1 = "A", string side2 = "B", string side3 = "C") {
    filldraw(tile_position, tile_colour);
    label(id, label_up_right * tile_position, NE, tile_label);
    label(side1, (point(tile_position, 3)--point(tile_position, 2)), NW, side_label);
    label(side2, (point(tile_position, 2)--point(tile_position, 1)), NE, side_label);
    label(side3, (point(tile_position, 1)--point(tile_position, 3)), S, side_label);
}

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
real tile_scale = ((face_side - (tile_gap * 3)) / 2) / face_side;
path reference_tile = scale(tile_scale) * polygon(3);
// Reference tile is centered on origin.
real tile_offset_x = point(reference_tile, 0).x + (tile_gap / 2);
real tile_offset_y = -point(reference_tile, 0).y + (tile_gap / 2);
real tile_offset_y2 = -point(reference_tile, 0).y * 2 + (tile_gap / 2);

// Face 1 tiles
path tile_1_1 = shift(tile_offset_x, tile_offset_y) * shift(face_1_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_1_2 = shift(-tile_offset_x, tile_offset_y) * shift(face_1_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_1_3 = shift(face_1_center) * scale(tile_scale) * polygon(3);
path tile_1_4 = shift(0, -tile_offset_y2) * shift(face_1_center) * scale(tile_scale) * rotate(60) * polygon(3);

tile_position_down(tile_1_1, "1-1");
tile_position_down(tile_1_2, "1-2");
tile_position_up(tile_1_3, "1-3");
tile_position_down(tile_1_4, "1-4");

// Face 2 tiles
path tile_2_1 = shift(0, tile_offset_y2) * shift(face_2_center) * scale(tile_scale) * polygon(3);
path tile_2_2 = shift(-tile_offset_x, -tile_offset_y) * shift(face_2_center) * scale(tile_scale) * polygon(3);
path tile_2_3 = shift(face_2_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_2_4 = shift(tile_offset_x, -tile_offset_y) * shift(face_2_center) * scale(tile_scale) * polygon(3);

tile_position_up(tile_2_1, "2-1");
tile_position_up(tile_2_2, "2-2");
tile_position_down(tile_2_3, "2-3");
tile_position_up(tile_2_4, "2-4");

// Face 3 tiles
path tile_3_1 = shift(tile_offset_x, -tile_offset_y) * shift(face_3_center) * scale(tile_scale) * polygon(3);
path tile_3_2 = shift(0, tile_offset_y2) * shift(face_3_center) * scale(tile_scale) * polygon(3);
path tile_3_3 = shift(face_3_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_3_4 = shift(-tile_offset_x, -tile_offset_y) * shift(face_3_center) * scale(tile_scale) * polygon(3);

tile_position_up(tile_3_1, "3-1", "C", "A", "B");
tile_position_up(tile_3_2, "3-2", "C", "A", "B");
tile_position_down(tile_3_3, "3-3", "C", "A", "B");
tile_position_up(tile_3_4, "3-4", "C", "A", "B");

// Face 4 tiles
path tile_4_3 = shift(face_4_center) * scale(tile_scale) * rotate(60) * polygon(3);
path tile_4_1 = shift(-tile_offset_x, -tile_offset_y) * shift(face_4_center) * scale(tile_scale) * polygon(3);
path tile_4_4 = shift(0, tile_offset_y2) * shift(face_4_center) * scale(tile_scale) * polygon(3);
path tile_4_2 = shift(tile_offset_x, -tile_offset_y) * shift(face_4_center) * scale(tile_scale) * polygon(3);

tile_position_up(tile_4_1, "4-1", "B", "C", "A");
tile_position_up(tile_4_2, "4-2", "B", "C", "A");
tile_position_down(tile_4_3, "4-3", "B", "C", "A");
tile_position_up(tile_4_4, "4-4", "B", "C", "A");

label("*Outward facing surfaces shown.", (point(face_4, 2).x, point(face_2, 1).y), E, note_label);
label("*Face-Tile", (point(face_4, 2).x, point(face_2, 1).y - 0.125), E, note_label);

// Title
label("Tile positions for the Pocket puzzle.", (0, point(face_1, 2).y - 0.4), N, title_label);
