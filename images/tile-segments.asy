// Drawing file for asymptote (https://asymptote.sourceforge.io/).

// Settings for svg output (can also use pdf).
settings.libgs="";
settings.outformat="svg";

import geometry;

// Size and formatting
size(10cm);
unitsize(3cm);
pen side = fontsize(12pt) + linewidth(1);
pen divider = dashed + gray;
pen segment = fontsize(10pt);
transform label_up = shift(0, 0.05);
transform label_down = shift(0, -0.05);
transform label_left = shift(-0.05, 0);
transform label_right = shift(0.05, 0);
pen title_label = fontsize(14pt);


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

// Sides
path sideA = (A--B);
path sideB = (B--C);
path sideC = (C--A);

draw(Label("Side A"), sideA, NE, side);
draw(Label("Side B"), sideB, S, side);
draw(Label("Side C"), sideC, NW, side);

// Medians
path medianA = (A--(-A.x,-A.y/1.4));
path medianB = (B--(-B.x,-B.y));
path medianC = (C--(-C.x,-C.y));

draw(medianA, divider);
draw(medianB, divider);
draw(medianC, divider);

// Parallels
path parallelA = ((-A.y,-A.x)--(A.y,A.x));
path parallelB = ((-B.y,-B.x)--(B.y,B.x));
path parallelC = ((-C.y,-C.x)--(C.y,C.x));

draw(parallelA, divider);
draw(parallelB, divider);
draw(parallelC, divider);

// Segments are numbered clockwise from A: Seg1, Seg2, Seg3, ... Seg12
// Odd numbers are shown filled red, even are left white.

point a1 = intersectionpoint(sideA, parallelC);
path seg1 = (origin--A--a1--cycle);
fill(seg1, red);
label("Seg1", label_down * label_down * (origin--A), E, segment);

point a2 = intersectionpoint(sideA, medianC);
label("Seg2", label_down * label_down * (a1--a2), segment);

point a3 = intersectionpoint(sideA, parallelA);
path seg3 = (origin--a2--a3--cycle);
fill(seg3, red);
label("Seg3", (a2--a3), segment);

label("Seg4", label_up * label_up * label_left * label_left * (a3--B), segment);

point b1 = intersectionpoint(sideB, parallelB);
path seg5 = (origin--B--b1--cycle);
fill(seg5, red);
label("Seg5", label_up * label_left * label_left * label_left * (B--b1), segment);

point b2 = intersectionpoint(sideB, medianA);
label("Seg6", label_up * label_left * (b1--b2), segment);

point b3 = intersectionpoint(sideB, parallelC);
path seg7 = (origin--b2--b3--cycle);
fill(seg7, red);
label("Seg7", label_up * label_right * (b2--b3), segment);

label("Seg8", label_up * label_right * label_right * label_right * (b3--C), segment);

point c1 = intersectionpoint(sideC, parallelA);
path seg9 = (origin--C--c1--cycle);
fill(seg9, red);
label("Seg9", label_up * label_up * label_right * label_right * (C--c1), segment);

point c2 = intersectionpoint(sideC, medianB);
label("Seg10", (c1--c2), segment);

point c3 = intersectionpoint(sideC, parallelB);
path seg11 = (origin--c2--c3--cycle);
fill(seg11, red);
label("Seg11", label_down * label_down * (c2--c3), segment);

label("Seg12", label_down * label_down * (origin--A), W, segment);

// Title
label("The 12 segments on a tile.", (0, b3.y - 0.4), N, title_label);
