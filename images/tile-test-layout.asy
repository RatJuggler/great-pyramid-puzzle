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
pen side_label = fontsize(12pt);
pen note_label = fontsize(8pt);
pen face_colour = palegray;
pen title_label = fontsize(14pt);


void draw_tile(real tile_scale, point center, int rotateTo) {
    path tile = scale(tile_scale) * polygon(3);
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
    transform toPosition = shift(center) * rotate(rotateTo);
    fill(toPosition * ((0, 0)--A--seg1--cycle), red);
    fill(toPosition * ((0, 0)--seg1--seg2--cycle), white);
    fill(toPosition * ((0, 0)--seg2--seg3--cycle), red);
    fill(toPosition * ((0, 0)--seg3--B--cycle), white);
    fill(toPosition * ((0, 0)--B--seg5--cycle), red);
    fill(toPosition * ((0, 0)--seg5--seg6--cycle), white);
    fill(toPosition * ((0, 0)--seg6--seg7--cycle), red);
    fill(toPosition * ((0, 0)--seg7--C--cycle), white);
    fill(toPosition * ((0, 0)--C--seg9--cycle), red);
    fill(toPosition * ((0, 0)--seg9--seg10--cycle), white);
    fill(toPosition * ((0, 0)--seg10--seg11--cycle), red);
    fill(toPosition * ((0, 0)--seg11--A--cycle), white);
    draw(toPosition * tile, black);
    label("A", toPosition * sideA, side_label);
    label("B", toPosition * sideB, side_label);
    label("C", toPosition * sideC, side_label);
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
draw_tile(tile_scale, face_1_center, -60);

// Face 2 tile
draw_tile(tile_scale, face_2_center, 0);

// Face 3 tile
draw_tile(tile_scale, face_3_center, 0);

// Face 4 tile
draw_tile(tile_scale, face_4_center, 0);

label("*Outward facing surfaces shown.", (point(face_4, 2).x, point(face_2, 1).y), E, note_label);
label("*Face-Tile-Side.", (point(face_4, 2).x, point(face_2, 1).y - 0.125), E, note_label);

// Title
label("Test puzzle tile layout.", (0, point(face_1, 2).y - 0.4), N, title_label);
