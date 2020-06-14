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

// Tetrahedron triangle faces, outward facing so would fold down
point face_a_center = (0, 0);
path face_a = rotate(60) * polygon(3);
point face_b_center = (0, -point(face_a, 2).y + face_gap);
path face_b = shift(face_b_center) * polygon(3);
point face_c_center = (point(face_a, 0).x + face_gap, point(face_a, 2).y + point(face_a, 1).y - (face_gap * 0.5));
path face_c = shift(face_c_center) * polygon(3);
point face_d_center = (-point(face_a, 0).x - face_gap, point(face_a, 2).y + point(face_a, 1).y - (face_gap * 0.5));
path face_d = shift(face_d_center) * polygon(3);

dot(face_a_center);
label("Face A", face_a_center, N, face_label);
draw(Label("A1"), (point(face_a, 0)--point(face_a, 1)), S, side_label);
draw(Label("A3"), (point(face_a, 1)--point(face_a, 2)), E, side_label);
draw(Label("A2"), (point(face_a, 2)--point(face_a, 3)), W, side_label);

dot(face_b_center);
label("Face B", face_b_center, N, face_label);
path B1 = (point(face_b, 0)--point(face_b, 1));
draw(Label("B1"), B1, E, side_label);
draw(Label("B2"), (point(face_b, 2)--point(face_b, 3)), N, side_label);
path B3 = (point(face_b, 1)--point(face_b, 2));
draw(Label("B3"), B3, W, side_label);

dot(face_c_center);
label("Face C", face_c_center, S, face_label);
path C3 = (point(face_c, 0)--point(face_c, 1));
draw(Label("C3"), C3, E, side_label);
draw(Label("C2"), (point(face_c, 1)--point(face_c, 2)), E, side_label);
path C1 = (point(face_c, 2)--point(face_c, 3));
draw(Label("C1"), C1, S, side_label);

dot(face_d_center);
label("Face D", face_d_center, S, face_label);
draw(Label("D2"), (point(face_d, 0)--point(face_d, 1)), W, side_label);
path D1 = (point(face_d, 1)--point(face_d, 2));
draw(Label("D1"), D1, W, side_label);
path D3 = (point(face_d, 2)--point(face_d, 3));
draw(Label("D3"), D3, S, side_label);

draw(midpoint(B1)..(midpoint(C3).x, point(face_a, 0).y)..midpoint(C3), black, Arrows);
draw(midpoint(C1)..(0, point(face_a, 2).y - point(face_a, 0).y)..midpoint(D3), black, Arrows);
draw(midpoint(D1)..(midpoint(D1).x, point(face_a, 1).y)..midpoint(B3), black, Arrows);
