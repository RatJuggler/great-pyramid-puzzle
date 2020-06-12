// Drawing file for asymptote (https://asymptote.sourceforge.io/).

// Settings for svg output (can also use pdf).
settings.libgs="";
settings.outformat="svg";

import geometry;

size(10cm, 0);
defaultpen(fontsize(12pt));
pen divider = dashed + gray;

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

dot(A);
dot(B);
dot(C);

label("A", A, N);
label("B", B, E);
label("C", C, W);

// Sides
path side1 = (A--B);
path side2 = (B--C);
path side3 = (C--A);

draw(side1);
draw(side2);
draw(side3);

label("Side1", side1, NE);
label("Side2", side2, S);
label("Side3", side3, NW);

// Bisectors
path bisectorA = (A--(-A.x,-A.y));
path bisectorB = (B--(-B.x,-B.y));
path bisectorC = (C--(-C.x,-C.y));

draw(bisectorA, divider);
draw(bisectorB, divider);
draw(bisectorC, divider);

// Parallels
path parallelA = ((-A.y,-A.x)--(A.y,A.x));
path parallelB = ((-B.y,-B.x)--(B.y,B.x));
path parallelC = ((-C.y,-C.x)--(C.y,C.x));

draw(parallelA, divider);
draw(parallelB, divider);
draw(parallelC, divider);

// Segments are numbered clockwise from A: Seg1, Seg2, Seg3, ... Seg12
// Odd numbers are shown filled red, even are left white.

point a1 = intersectionpoint(side1, parallelC);
path seg1 = (origin--A--a1--cycle);
fill(seg1, red);
label("Seg1", (origin--A), E);

point a2 = intersectionpoint(side1, bisectorC);
label("Seg2", (a1--a2), SW);

point a3 = intersectionpoint(side1, parallelA);
path seg3 = (origin--a2--a3--cycle);
fill(seg3, red);
label("Seg3", (a2--a3));

label("Seg4", (a3--B));

point b1 = intersectionpoint(side2, parallelB);
path seg5 = (origin--B--b1--cycle);
fill(seg5, red);
label("Seg5", (B--b1));

point b2 = intersectionpoint(side2, bisectorA);
label("Seg6", (b1--b2));

point b3 = intersectionpoint(side2, parallelC);
path seg7 = (origin--b2--b3--cycle);
fill(seg7, red);
label("Seg7", (b2--b3));

label("Seg8", (b3--C));

point c1 = intersectionpoint(side3, parallelA);
path seg9 = (origin--C--c1--cycle);
fill(seg9, red);
label("Seg9", (C--c1));

point c2 = intersectionpoint(side3, bisectorB);
label("Seg10", (c1--c2));

point c3 = intersectionpoint(side3, parallelB);
path seg11 = (origin--c2--c3--cycle);
fill(seg11, red);
label("Seg11", (c2--c3), SE);

label("Seg12", (origin--A), W);
