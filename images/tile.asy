settings.outformat="pdf";

import geometry;

size(5cm, 0);

// Origin
point origin = (0, 0);
dot(origin);

// Basic circle and triangle forms
real radius = 1;
circle a_circle = circle(origin, radius);
path a_triangle = polygon(3);

// Points
point A = point(a_triangle, 1);
point B = point(a_triangle, 0);
point C = point(a_triangle, 2);

dot(Label("A"), A);
dot(Label("B"), B);
dot(Label("C"), C);

// Sides
path side1 = (A--B);
path side2 = (B--C);
path side3 = (C--A);

draw("1", side1);
draw("2", side2);
draw("3", side3);

// Bisectors
path bisectorA = (A--(-A.x,-A.y));
path bisectorB = (B--(-B.x,-B.y));
path bisectorC = (C--(-C.x,-C.y));

draw(bisectorA);
draw(bisectorB);
draw(bisectorC);

// Parallels
path parallelA = ((-A.y,-A.x)--(A.y,A.x));
path parallelB = ((-B.y,-B.x)--(B.y,B.x));
path parallelC = ((-C.y,-C.x)--(C.y,C.x));

draw(parallelA);
draw(parallelB);
draw(parallelC);

// Triangles numbered clockwise from A: t1, t2, t3, ... t12
// Odd numbers are filled red, even are left white.

point a1 = intersectionpoint(side1, parallelC);
path t1 = (origin--A--a1--cycle);
fill(t1, red);

point a2 = intersectionpoint(side1, bisectorC);
point a3 = intersectionpoint(side1, parallelA);
path t3 = (origin--a2--a3--cycle);
fill(t3, red);

point b1 = intersectionpoint(side2, parallelB);
path t5 = (origin--B--b1--cycle);
fill(t5, red);

point b2 = intersectionpoint(side2, bisectorA);
point b3 = intersectionpoint(side2, parallelC);
path t7 = (origin--b2--b3--cycle);
fill(t7, red);

point c1 = intersectionpoint(side3, parallelA);
path t9 = (origin--C--c1--cycle);
fill(t9, red);

point c2 = intersectionpoint(side3, bisectorB);
point c3 = intersectionpoint(side3, parallelB);
path t11 = (origin--c2--c3--cycle);
fill(t11, red);
