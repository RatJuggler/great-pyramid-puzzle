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
pen side_label = fontsize(10pt);
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
real tile_scale = (face_side - (tile_gap * 2)) / face_side;

// Face 1 tile
path tile_1_1 = shift(face_1_center) * scale(tile_scale) * rotate(60) * polygon(3);

filldraw(tile_1_1, tile_colour);
label("1-1", face_1_center, tile_label);
label("1-1-A", (point(face_1, 2)--point(face_1, 3)), 3 * W, side_label);
label("1-1-B", (point(face_1, 1)--point(face_1, 2)), 3 * E, side_label);
label("1-1-C", (point(face_1, 0)--point(face_1, 1)), 3 * S, side_label);

// Face 2 tile
path tile_2_1 = shift(face_2_center) * scale(tile_scale) * polygon(3);

filldraw(tile_2_1, tile_colour);
label("2-1", face_2_center, tile_label);
path A2 = (point(face_2, 0)--point(face_2, 1));
label("2-1-A", A2, 3 * W, side_label);
label("2-1-B", (point(face_2, 2)--point(face_2, 3)), 3 * N, side_label);
path C2 = (point(face_2, 1)--point(face_2, 2));
label("2-1-C", C2, 3 * E, side_label);

// Face 3 tile
path tile_3_1 = shift(face_3_center) * scale(tile_scale) * polygon(3);

filldraw(tile_3_1, tile_colour);
label("3-1", face_3_center, tile_label);
path A3 = (point(face_3, 2)--point(face_3, 3));
label("3-1-A", A3, 3 * N, side_label);
label("3-1-B", (point(face_3, 1)--point(face_3, 2)), 3 * E, side_label);
path C3 = (point(face_3, 0)--point(face_3, 1));
label("3-1-C", C3, 3 * W, side_label);

// Face 4 tile
path tile_4_1 = shift(face_4_center) * scale(tile_scale) * polygon(3);

filldraw(tile_4_1, tile_colour);
label("4-1", face_4_center, tile_label);
path A4 = (point(face_4, 1)--point(face_4, 2));
label("4-1-A", A4, 3 * E, side_label);
label("4-1-B", (point(face_4, 0)--point(face_4, 1)), 3 * W, side_label);
path C4 = (point(face_4, 2)--point(face_4, 3));
label("4-1-C", C4, 3 * N, side_label);

label("*Outward facing surfaces shown.", (point(face_4, 2).x, point(face_2, 1).y), E, note_label);
label("*Face-Tile-Side.", (point(face_4, 2).x, point(face_2, 1).y - 0.125), E, note_label);

// Title
label("Tile positions for the Test puzzle.", (0, point(face_1, 2).y - 0.4), N, title_label);
