settings.outformat="pdf";

import geometry;

size(5cm, 0);

point origin = (0, 0);
dot(origin);

real radius = 1;
circle a_circle = circle(origin, radius);
// draw(a_circle);

path a_triangle = polygon(3);
// draw(a_triangle);

point A = point(a_triangle, 1);
point B = point(a_triangle, 0);
point C = point(a_triangle, 2);

dot(Label("A"), A);
dot(Label("B"), B);
dot(Label("C"), C);

path side1 = (A--B);
path side2 = (B--C);
path side3 = (C--A);

draw("1", side1);
draw("2", side2);
draw("3", side3);

// Bisectors
draw(A--(-A.x,-A.y));
draw(B--(-B.x,-B.y));
draw(C--(-C.x,-C.y));

// Parallels
draw((-A.y,-A.x)--(A.y,A.x));
draw((-B.y,-B.x)--(B.y,B.x));
draw((-C.y,-C.x)--(C.y,C.x));

// Triangles numbered clockwise from A: t1, t2, t3, ... t12
// Odd numbers are filled red, even are left white.

point a1 = intersectionpoint(side1, (origin--(-C.y,-C.x)));
path t1 = (origin--A--a1--cycle);
fill(t1, red);

point a2 = intersectionpoint(side1, (origin--(-C.x,-C.y)));
point a3 = intersectionpoint(side1, (origin--(A.y,A.x)));
path t3 = (origin--a2--a3--cycle);
fill(t3, red);

point b1 = intersectionpoint(side2, (origin--(-B.y,-B.x)));
path t5 = (origin--B--b1--cycle);
fill(t5, red);

point b2 = intersectionpoint(side2, (origin--(-A.x,-A.y)));
point b3 = intersectionpoint(side2, (origin--(C.y,C.x)));
path t7 = (origin--b2--b3--cycle);
fill(t7, red);

point c1 = intersectionpoint(side3, (origin--(-A.y,-A.x)));
path t9 = (origin--C--c1--cycle);
fill(t9, red);

point c2 = intersectionpoint(side3, (origin--(-B.x,-B.y)));
point c3 = intersectionpoint(side3, (origin--(B.y,B.x)));
path t11 = (origin--c2--c3--cycle);
fill(t11, red);
