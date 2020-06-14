// Drawing file for asymptote (https://asymptote.sourceforge.io/).

// Settings for svg output (can also use pdf).
settings.libgs="";
settings.outformat="pdf";

import geometry;

// Size
size(10cm, 0);

// Origin
point origin = (0, 0);
dot(origin);

// Tetrahedron triangle face forms
path face_a = polygon(3);
real move_ay = -point(face_a, 0).y + 0.05;
face_a = shift(0, move_ay) * face_a;
path face_b = shift(0, -move_ay) * rotate(60) * polygon(3);
real move_bx = point(face_b, 0).x + 0.1;
path face_c = shift(move_bx, -1 - 0.05) * polygon(3);
path face_d = shift(-move_bx, -1 - 0.05) * polygon(3);

draw(face_a);
draw(face_b);
draw(face_c);
draw(face_d);

write(face_a);
write(face_b);
write(face_c);
write(face_d);
