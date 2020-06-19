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


// Tetrahedron triangle faces, outward facing surfaces will be shown so would fold down
point face_1_center = (0, 0);
path face_1 = rotate(60) * polygon(3);
point face_2_center = (0, -point(face_1, 2).y + face_gap);
path face_2 = shift(face_2_center) * polygon(3);
point face_3_center = (point(face_1, 0).x + face_gap, -point(face_1, 1).y - (face_gap * 0.5));
path face_3 = shift(face_3_center) * polygon(3);
point face_4_center = (-point(face_1, 0).x - face_gap, -point(face_1, 1).y - (face_gap * 0.5));
path face_4 = shift(face_4_center) * polygon(3);

dot(Label("Face 1"), face_1_center, N, face_label);
filldraw(face_1, face_colour);
label("1-A", (point(face_1, 2)--point(face_1, 3)), W, side_label);
label("1-B", (point(face_1, 1)--point(face_1, 2)), E, side_label);
label("1-C", (point(face_1, 0)--point(face_1, 1)), S, side_label);

dot(Label("Face 2"), face_2_center, S, face_label);
filldraw(face_2, face_colour);
path B1 = (point(face_2, 0)--point(face_2, 1));
label("2-A", B1, W, side_label);
label("2-B", (point(face_2, 2)--point(face_2, 3)), N, side_label);
path B3 = (point(face_2, 1)--point(face_2, 2));
label("2-C", B3, E, side_label);

dot(Label("Face 3"), face_3_center, S, face_label);
filldraw(face_3, face_colour);
path C1 = (point(face_3, 2)--point(face_3, 3));
label("3-A", C1, N, side_label);
label("3-B", (point(face_3, 1)--point(face_3, 2)), E, side_label);
path C3 = (point(face_3, 0)--point(face_3, 1));
label("3-C", C3, W, side_label);

dot(Label("Face 4"), face_4_center, S, face_label);
filldraw(face_4, face_colour);
path D1 = (point(face_4, 1)--point(face_4, 2));
label("4-A", D1, E, side_label);
label("4-B", (point(face_4, 0)--point(face_4, 1)), W, side_label);
path D3 = (point(face_4, 2)--point(face_4, 3));
label("4-C", D3, N, side_label);

draw(midpoint(B1)..(midpoint(C3).x, point(face_1, 0).y)..midpoint(C3), gray, Arrows);
draw(midpoint(C1)..(0, point(face_1, 2).y - point(face_1, 0).y)..midpoint(D3), gray, Arrows);
draw(midpoint(D1)..(midpoint(D1).x, point(face_1, 1).y)..midpoint(B3), gray, Arrows);

label("*Outward facing surfaces shown.", (point(face_4, 2).x, point(face_2, 1).y), E, note_label);

// Title
label("Faces and sides of the tetrahedron.", (0, point(face_1, 2).y - 0.4), N, title_label);
