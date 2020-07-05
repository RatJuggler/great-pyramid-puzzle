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


void drawTilePosition(path tilePosition, point tile_center, string tile_id, align a_align, align b_align, align c_align) {
    filldraw(tilePosition, tile_colour);
    label(tile_id, tile_center, tile_label);
    label(tile_id + "-A", (point(tilePosition, 1)--point(tilePosition, 0)), a_align, side_label);
    label(tile_id + "-B", (point(tilePosition, 0)--point(tilePosition, 2)), b_align, side_label);
    label(tile_id + "-C", (point(tilePosition, 2)--point(tilePosition, 1)), c_align, side_label);
}

// Tetrahedron faces, outward facing surfaces will be shown so these would fold down.
// Faces are created and rotated to maintain side labeling consistency.
point face_1_center = (0, 0);
path face_1 = rotate(-60) * polygon(3);
point face_2_center = (0, -point(face_1, 0).y + face_gap);
path face_2 = shift(face_2_center) * polygon(3);
point face_3_center = (point(face_1, 1).x + face_gap, -point(face_1, 2).y - (face_gap * 0.5));
path face_3 = shift(face_3_center) * rotate(-120) * polygon(3);
point face_4_center = (-point(face_1, 1).x - face_gap, -point(face_1, 2).y - (face_gap * 0.5));
path face_4 = shift(face_4_center) * rotate(120) * polygon(3);

filldraw(face_1, face_colour);
filldraw(face_2, face_colour);
filldraw(face_3, face_colour);
filldraw(face_4, face_colour);

// Fit tiles onto a face.
// Tiles are created and rotated to maintain side labeling consistency.
real face_side = length(point(face_1, 0)--point(face_1, 1));
real tile_scale = (face_side - (tile_gap * 2)) / face_side;

// Face 1 tile position
path tile_1_1 = shift(face_1_center) * scale(tile_scale) * rotate(-60) * polygon(3);

drawTilePosition(tile_1_1, face_1_center, "1-1", W, E, S);

// Face 2 tile position
path tile_2_1 = shift(face_2_center) * scale(tile_scale) * polygon(3);

drawTilePosition(tile_2_1, face_2_center, "2-1", W, N, E);

// Face 3 tile position
path tile_3_1 = shift(face_3_center) * scale(tile_scale) * rotate(-120) * polygon(3);

drawTilePosition(tile_3_1, face_3_center, "3-1", N, E, W);

// Face 4 tile position
path tile_4_1 = shift(face_4_center) * scale(tile_scale) * rotate(120) * polygon(3);

drawTilePosition(tile_4_1, face_4_center, "4-1", E, W, N);

// Notes
label("*Outward facing surfaces shown.", (point(face_4, 1).x, point(face_2, 1).y), E, note_label);
label("*Face-Tile-Side.", (point(face_4, 1).x, point(face_2, 1).y - 0.125), E, note_label);

// Title
label("Tile positions for the Test puzzle.", (0, point(face_1, 0).y - 0.4), N, title_label);
