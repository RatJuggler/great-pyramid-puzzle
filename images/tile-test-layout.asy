// Drawing file for asymptote (https://asymptote.sourceforge.io/).

// Settings for svg output (can also use pdf).
settings.libgs="";
settings.outformat="pdf";

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

pen divider = dashed + gray;


void draw_tile(real tile_scale, int idxA, int idxB, int idxC, point center, int rotateTo) {
    path tile = scale(tile_scale) * rotate(rotateTo) * polygon(3);
    // Points
    point A = point(tile, idxA);
    point B = point(tile, idxB);
    point C = point(tile, idxC);
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
//    point seg3 = rotate(rotateTo) * intersectionpoint(sideA, parallelA);
//    point seg5 = intersectionpoint(sideB, parallelB);
//    point seg6 = intersectionpoint(sideB, medianA);
//    point seg7 = intersectionpoint(sideB, parallelC);
//    point seg9 = intersectionpoint(sideC, parallelA);
//    point seg10 = intersectionpoint(sideC, medianB);
//    point seg11 = intersectionpoint(sideC, parallelB);
    // Shift and Draw
    transform toPosition = shift(center);
    filldraw(toPosition * tile, tile_colour);
    label("A", toPosition * sideA, side_label);
    label("B", toPosition * sideB, side_label);
    label("C", toPosition * sideC, side_label);
//    draw(toPosition * medianA, divider);
//    draw(toPosition * medianB, divider);
//    draw(toPosition * medianC, divider);
//    draw(toPosition * parallelA, divider);
//    draw(toPosition * parallelB, divider);
    draw(toPosition * parallelC, divider);
    fill(toPosition * ((0, 0)--A--seg1--cycle), red);
    fill(toPosition * ((0, 0)--seg1--seg2--cycle), white);
//    fill((origin--seg2--seg3--cycle), red);
//    fill((origin--seg3--seg4--cycle), red);
//    fill((origin--B--b1--cycle), red);
//    fill((origin--b2--b3--cycle), red);
//    fill((origin--C--c1--cycle), red);
//    fill((origin--c2--c3--cycle), red);
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
real tile_scale = (face_side - (tile_gap * 2)) / face_side;

// Face 1 tile
draw_tile(tile_scale, 1, 0, 2, face_1_center, 0);

// Face 2 tile
draw_tile(tile_scale, 1, 0, 2, face_2_center, 0);

// Face 3 tile
draw_tile(tile_scale, 1, 0, 2, face_3_center, 0);

// Face 4 tile
draw_tile(tile_scale, 1, 0, 2, face_4_center, 0);

label("*Outward facing surfaces shown.", (point(face_4, 2).x, point(face_2, 1).y), E, note_label);
label("*Face-Tile-Side.", (point(face_4, 2).x, point(face_2, 1).y - 0.125), E, note_label);

// Title
label("Test puzzle Tile layout.", (0, point(face_1, 2).y - 0.4), N, title_label);
