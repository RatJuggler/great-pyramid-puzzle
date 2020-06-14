// Drawing file for asymptote (https://asymptote.sourceforge.io/).

// Settings for svg output (can also use pdf).
settings.libgs="";
settings.outformat="pdf";

import geometry;

// Size and formatting
size(10cm, 0);
real face_gap = 0.05;
pen face_label = fontsize(12pt);
pen side_label = fontsize(10pt);

// Tetrahedron triangle face forms
point face_a_center = (0, 0);
path face_a = polygon(3);
point face_b_center = (0, -point(face_a, 1).y - face_gap);
path face_b = shift(face_b_center) * rotate(60) * polygon(3);
point face_c_center = (point(face_a, 0).x + face_gap, point(face_a, 0).y - point(face_a, 1).y - (face_gap * 1.5));
path face_c = shift(face_c_center) * polygon(3);
point face_d_center = (-point(face_a, 0).x - face_gap, point(face_a, 0).y - point(face_a, 1).y - (face_gap * 1.5));
path face_d = shift(face_d_center) * polygon(3);

dot(face_a_center);
label("Face A", face_a_center, N, face_label);
draw(face_a);
label("A1", (point(face_a, 0)--point(face_a, 1)), E, side_label);
label("A2", (point(face_a, 2)--point(face_a, 3)), N, side_label);
label("A3", (point(face_a, 1)--point(face_a, 2)), W, side_label);

dot(face_b_center);
label("Face B", face_b_center, N, face_label);
draw(face_b);
label("B2", (point(face_b, 0)--point(face_b, 1)), S, side_label);
label("B3", (point(face_b, 2)--point(face_b, 3)), W, side_label);
label("B1", (point(face_b, 1)--point(face_b, 2)), E, side_label);

dot(face_c_center);
label("Face C", face_c_center, S, face_label);
draw(face_c);
label("C1", (point(face_c, 0)--point(face_c, 1)), E, side_label);
label("C2", (point(face_c, 2)--point(face_c, 3)), S, side_label);
label("C3", (point(face_c, 1)--point(face_c, 2)), E, side_label);

dot(face_d_center);
label("Face D", face_d_center, S, face_label);
draw(face_d);
label("D1", (point(face_d, 0)--point(face_d, 1)), W, side_label);
label("D2", (point(face_d, 2)--point(face_d, 3)), S, side_label);
label("D3", (point(face_d, 1)--point(face_d, 2)), W, side_label);

draw("", point(face_a, 1)..(point(face_c, 0).x, point(face_b, 0).y)..point(face_c, 0), black, Arrows);
draw("", point(face_c, 0)..point(face_d, 2), black, Arrows);
draw("", point(face_d, 2)..(point(face_d, 2).x, point(face_b, 1).y)..point(face_a, 1), black, Arrows);
