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


void drawTilePosition(point center, real scale, int rotate, string id, align a_align, align b_align, align c_align) {
    path position = shift(center) * scale(scale) * rotate(rotate) * polygon(3);
    filldraw(position, tile_colour);
    label(id, center, tile_label);
    label(id + "-A", (point(position, 1)--point(position, 0)), a_align, side_label);
    label(id + "-B", (point(position, 0)--point(position, 2)), b_align, side_label);
    label(id + "-C", (point(position, 2)--point(position, 1)), c_align, side_label);
}

path drawFace(point center, int rotate) {
    path face = shift(center) * rotate(rotate) * polygon(3);
    filldraw(face, face_colour);
    return face;
}

// Reference triangle and height.
path ref = polygon(3);
real height = abs(point(ref, 0).y);

// Tetrahedron faces, outward facing surfaces will be shown so these would fold down.
// Faces are created and rotated to maintain side labeling consistency.
path face_1 = drawFace((0, 0), -60);
path face_2 = drawFace((0, height * 2 + face_gap), 0);
path face_3 = drawFace((point(ref, 0).x + face_gap, -height - face_gap), -120);
path face_4 = drawFace((point(ref, 2).x - face_gap, -height - face_gap), 120);

// Fit tiles onto a face.
// Tiles are created and rotated to maintain side labeling consistency.
real face_side = length(point(ref, 0)--point(ref, 1));
real tile_scale = (face_side - (tile_gap * 2)) / face_side;

drawTilePosition((0, 0), tile_scale, -60, "1-1", W, E, S);
drawTilePosition((0, height * 2 + face_gap), tile_scale, 0, "2-1", W, N, E);
drawTilePosition((point(ref, 0).x + face_gap, -height - face_gap), tile_scale, -120, "3-1", N, E, W);
drawTilePosition((point(ref, 2).x - face_gap, -height - face_gap), tile_scale, 120, "4-1", E, W, N);

// Notes
label("*Outward facing surfaces shown.", (point(face_4, 1).x, point(face_2, 1).y), E, note_label);
label("*Face-Tile-Side.", (point(face_4, 1).x, point(face_2, 1).y - 0.125), E, note_label);

// Title
label("Tile positions for the Test puzzle.", (0, point(face_1, 0).y - 0.4), N, title_label);
