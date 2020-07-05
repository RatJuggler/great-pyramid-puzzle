// Drawing file for asymptote (https://asymptote.sourceforge.io/).

// Settings for svg output (can also use pdf).
settings.libgs="";
settings.outformat="svg";

import geometry;

// Size and formatting
size(10cm);
unitsize(3cm);
real face_gap = 0.05;
pen face_label = fontsize(12pt);
pen side_label = fontsize(10pt);
pen note_label = fontsize(8pt);
pen face_colour = palegray + linewidth(1);
pen title_label = fontsize(14pt);



void drawFace(path face, point face_center, int face_id, align label_align, align a_align, align b_align, align c_align) {
    filldraw(face, face_colour);
    dot(Label(format("Face %d", face_id)), face_center, label_align, face_label);
    label(format("%d-A", face_id), (point(face, 1)--point(face, 0)), a_align, side_label);
    label(format("%d-B", face_id), (point(face, 0)--point(face, 2)), b_align, side_label);
    label(format("%d-C", face_id), (point(face, 2)--point(face, 1)), c_align, side_label);
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

drawFace(face_1, face_1_center, 1, N, W, E, S);
drawFace(face_2, face_2_center, 2, S, W, N, E);
drawFace(face_3, face_3_center, 3, S, N, E, W);
drawFace(face_4, face_4_center, 4, S, E, W, N);

// Midpoint side arrows.
point midpoint2A = midpoint(point(face_2, 0)--point(face_2, 1));
point midpoint3C = midpoint(point(face_3, 2)--point(face_3, 1));
draw(midpoint2A..(midpoint3C.x, point(face_1, 1).y)..midpoint3C, gray, Arrows);
point midpoint3A = midpoint(point(face_3, 1)--point(face_3, 0));
point midpoint4C = midpoint(point(face_4, 2)--point(face_4, 1));
draw(midpoint3A..(0, point(face_1, 0).y - point(face_1, 1).y)..midpoint4C, gray, Arrows);
point midpoint4A = midpoint(point(face_4, 1)--point(face_4, 0));
point midpoint2C = midpoint(point(face_2, 2)--point(face_2, 1));
draw(midpoint4A..(midpoint4A.x, point(face_1, 1).y)..midpoint2C, gray, Arrows);

// Notes
label("*Outward facing surfaces shown.", (point(face_4, 1).x, point(face_2, 1).y), E, note_label);
label("*Face-Side", (point(face_4, 1).x, point(face_2, 1).y - 0.125), E, note_label);

// Title
label("Faces and sides of the tetrahedron.", (0, point(face_1, 0).y - 0.4), N, title_label);
