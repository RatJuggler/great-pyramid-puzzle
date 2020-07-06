// Drawing file for asymptote (https://asymptote.sourceforge.io/).

// Settings for svg output (can also use pdf).
settings.libgs="";
settings.outformat="svg";

import geometry;

// Size and formatting
size(10cm);
unitsize(3cm);
real face_gap = 0.05;
real tile_gap = 0.03;
pen tile_label = fontsize(8pt);
pen note_label = fontsize(8pt);
pen side_label = fontsize(2pt);
pen face_colour = palegray;
pen tile_colour = lightgray;
pen title_label = fontsize(14pt);


path drawTilePosition(point center, real scale, int rotate, string id) {
    path position = shift(center) * scale(scale) * rotate(rotate) * polygon(3);
    filldraw(position, tile_colour);
    label(id, center, tile_label);
    align a_align = W; align b_align = N; align c_align = E;
    if (rotate == -60) {
        a_align = W; b_align = E; c_align = S;
    }
    if (rotate == -120) {
        a_align = N; b_align = E; c_align = W;
    }
    if (rotate == 120) {
        a_align = E; b_align = W; c_align = N;
    }
    if (rotate == 60) {
        a_align = S; b_align = W; c_align = E;
    }
    if (rotate == -180) {
        a_align = E; b_align = S; c_align = W;
    }
    label("A", (point(position, 1)--point(position, 0)), a_align, side_label);
    label("B", (point(position, 0)--point(position, 2)), b_align, side_label);
    label("C", (point(position, 2)--point(position, 1)), c_align, side_label);
    return position;
}

void drawTilesOnFace(real offset, real scale, int rotate, string id, real offset_x, real offset_y, real offset_y2) {
    point center = (0, offset);
    drawTilePosition(rotate(rotate) * (center + (0, offset_y2 * 2)), scale, rotate, id + "-1");
    drawTilePosition(rotate(rotate) * (center + (-offset_x, offset_y)), scale, rotate, id + "-2");
    drawTilePosition(rotate(rotate) * (center + (0, offset_y2)), scale, rotate - 60, id + "-3");
    drawTilePosition(rotate(rotate) * (center + (offset_x, offset_y)), scale, rotate, id + "-4");
    drawTilePosition(rotate(rotate) * (center + (-offset_x * 2, -offset_y2)), scale, rotate, id + "-5");
    drawTilePosition(rotate(rotate) * (center + (-offset_x, -offset_y)), scale, rotate - 60, id + "-6");
    drawTilePosition(rotate(rotate) * (center + (0, -offset_y2)), scale, rotate, id + "-7");
    drawTilePosition(rotate(rotate) * (center + (offset_x, -offset_y)), scale, rotate - 60, id + "-8");
    drawTilePosition(rotate(rotate) * (center + (offset_x * 2, -offset_y2)), scale, rotate, id + "-9");
}

path drawFace(real offset, int rotate) {
    point center = rotate(rotate) * (0, offset);
    path face = shift(center) * rotate(rotate) * polygon(3);
    filldraw(face, face_colour);
    return face;
}

// Reference triangle and height.
path ref = polygon(3);
real fOffset = abs(point(ref, 0).y) * 2 + face_gap;

// Tetrahedron faces, outward facing surfaces will be shown so these would fold down.
// Faces are created and rotated to maintain side labeling consistency.
path face_1 = drawFace(0, -60);
path face_2 = drawFace(fOffset, 0);
path face_3 = drawFace(fOffset, -120);
path face_4 = drawFace(fOffset, 120);

// Fit tiles onto a face.
// Tiles are created and rotated to maintain side labeling consistency.
real face_side = length(point(ref, 0)--point(ref, 1));
real tile_scale = ((face_side - (tile_gap * 4)) / 3) / face_side;
real tOffset_x = (point(ref, 0).x * tile_scale) + tile_gap;
real tOffset_y = (abs(point(ref, 0).y) * tile_scale) + tile_gap / 2;
real tOffset_y2 = (abs(point(ref, 0).y) * tile_scale * 2) + tile_gap;

drawTilesOnFace(0, tile_scale, -60, "1", tOffset_x, tOffset_y, tOffset_y2);
drawTilesOnFace(fOffset, tile_scale, 0, "2", tOffset_x, tOffset_y, tOffset_y2);
drawTilesOnFace(fOffset, tile_scale, -120, "3", tOffset_x, tOffset_y, tOffset_y2);
drawTilesOnFace(fOffset, tile_scale, 120, "4", tOffset_x, tOffset_y, tOffset_y2);

// Notes
label("*Outward facing surfaces shown.", (point(face_4, 1).x, point(face_2, 1).y), E, note_label);
label("*Face-Tile", (point(face_4, 1).x, point(face_2, 1).y - 0.125), E, note_label);

// Title
label("Tile positions for the Great puzzle.", (0, point(face_1, 0).y - 0.4), N, title_label);
