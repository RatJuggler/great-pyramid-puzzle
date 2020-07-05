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


path drawFace(point face_center, int rotate, string face_id, align label_align, align a_align, align b_align, align c_align) {
    path face = shift(face_center) * rotate(rotate) * polygon(3);
    filldraw(face, face_colour);
    dot(Label("Face " + face_id), face_center, label_align, face_label);
    label(face_id + "-A", (point(face, 1)--point(face, 0)), a_align, side_label);
    label(face_id + "-B", (point(face, 0)--point(face, 2)), b_align, side_label);
    label(face_id + "-C", (point(face, 2)--point(face, 1)), c_align, side_label);
    return face;
}

// Reference triangle and height.
path fRef = polygon(3);
real fheight = abs(point(fRef, 0).y);

// Tetrahedron faces, outward facing surfaces will be shown so these would fold down.
// Faces are created and rotated to maintain side labeling consistency.
path face_1 = drawFace((0, 0), -60, "1", N, W, E, S);
path face_2 = drawFace((0, fheight * 2 + face_gap), 0, "2", S, W, N, E);
path face_3 = drawFace((point(fRef, 0).x + face_gap, -fheight - face_gap), -120, "3", S, N, E, W);
path face_4 = drawFace((point(fRef, 2).x - face_gap, -fheight - face_gap), 120, "4", S, E, W, N);

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
