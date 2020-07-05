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
pen face_colour = palegray;
pen peg_colour = linewidth(15) + mediumgray;
pen side_label = fontsize(12pt);
pen note_label = fontsize(8pt);
pen title_label = fontsize(14pt);


void draw_segment(transform toPosition, point sp1, point sp2, point sp3, point sp4, point sp5, string code) {
    fill(toPosition * ((0, 0)--sp1--sp2--cycle), substr(code, 0, 1) == "0" ? white : red);
    fill(toPosition * ((0, 0)--sp2--sp3--cycle), substr(code, 1, 1) == "0" ? white : red);
    fill(toPosition * ((0, 0)--sp3--sp4--cycle), substr(code, 2, 1) == "0" ? white : red);
    fill(toPosition * ((0, 0)--sp4--sp5--cycle), substr(code, 3, 1) == "0" ? white : red);
}

void drawTileAtPosition(point center, real scale, int rotate, string id,
        align a_align, align b_align, align c_align,
        string codeA, string codeB, string codeC) {
    path tile = scale(scale) * polygon(3);
    // Points
    point A = point(tile, 1);
    point B = point(tile, 0);
    point C = point(tile, 2);
    // Sides
    path sideA = (A--B);
    path sideB = (B--C);
    path sideC = (C--A);
    // Medians
    path medianA = (A--(-A.x,-A.y));
    path medianB = (B--(-B.x,-B.y));
    path medianC = (C--(-C.x,-C.y));
    // Parallels
    path parallelA = ((-A.y,-A.x)--(A.y,A.x));
    path parallelB = ((-B.y,-B.x)--(B.y,B.x));
    path parallelC = ((-C.y,-C.x)--(C.y,C.x));
    // Segment Points
    point seg1 = intersectionpoint(sideA, parallelC);
    point seg2 = intersectionpoint(sideA, medianC);
    point seg3 = intersectionpoint(sideA, parallelA);
    point seg5 = intersectionpoint(sideB, parallelB);
    point seg6 = intersectionpoint(sideB, medianA);
    point seg7 = intersectionpoint(sideB, parallelC);
    point seg9 = intersectionpoint(sideC, parallelA);
    point seg10 = intersectionpoint(sideC, medianB);
    point seg11 = intersectionpoint(sideC, parallelB);
    // Shift and Draw
    transform toPosition = shift(center) * rotate(rotate);
    draw_segment(toPosition, A, seg1, seg2, seg3, B, codeA);
    draw_segment(toPosition, B, seg5, seg6, seg7, C, codeB);
    draw_segment(toPosition, C, seg9, seg10, seg11, A, codeC);
    draw(toPosition * tile, black);
    label("A", toPosition * sideA, side_label);
    label("B", toPosition * sideB, side_label);
    label("C", toPosition * sideC, side_label);
    dot(center, peg_colour);
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

drawTileAtPosition((0, 0), tile_scale, -60, "1-1", W, E, S, "0100", "0100", "1001");
drawTileAtPosition((0, height * 2 + face_gap), tile_scale, 0, "2-1", W, N, E, "0101", "1001", "1010");
drawTileAtPosition((point(ref, 0).x + face_gap, -height - face_gap), tile_scale, -120, "3-1", N, E, W, "0010", "0010", "1010");
drawTileAtPosition((point(ref, 2).x - face_gap, -height - face_gap), tile_scale, 120, "4-1", E, W, N, "0101", "0010", "0100");

// Notes
label("*Outward facing surfaces shown.", (point(face_4, 1).x, point(face_2, 1).y), E, note_label);

// Title
label("Test puzzle tile layout.", (0, point(face_1, 0).y - 0.4), N, title_label);
