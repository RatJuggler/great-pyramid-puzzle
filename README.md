# great-pyramid-puzzle

![Build & Test](https://github.com/RatJuggler/great-pyramid-puzzle/workflows/Build%20&%20Test/badge.svg)
![Build & Deploy](https://github.com/RatJuggler/great-pyramid-puzzle/workflows/Build%20&%20Deploy/badge.svg)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/RatJuggler/great-pyramid-puzzle)

The Great Pyramid Puzzle was a puzzle made by Eliot Inventions Ltd. in 1981. I tried solving it way back then on my 
[ZX80](https://en.wikipedia.org/wiki/ZX80), but didn't make much progress, so nearly 40 years later I'm trying again.

##### Progress
- Captured data representing the Pocket and Great version of the puzzle and a Simple version aimed at testing.
- Built data structures to hold the puzzle data and state.
- Created some tests to verify the basic functionality.
- Built mechanisms to add tiles to the puzzle, randomly or in sequence without matching, as a test.
- Built a display renderer using SVG to show the puzzle in a given state and to animate tiles as they are placed and removed.
- Built a UI with options to control the display and solving process.
- Brute Force solver working (cycles through every single possible combination of tiles, positions and orientations).
- Only Valid Tiles solver working (still cycles but only selects tiles to try which match existing tile sides).
- Allow solvers to run as dedicated web workers, without animation, for speed.
- Option to allow solvers to continue to search for further solutions.
- Report rough timings and number of steps (tiles added/removed/rotated) taken for each solver run.
- Human option, so you can drag and rotate the tiles yourself to try to solve it.
- Started work on a genetic algorithm solver, but it's not doing very well at the moment.

You can see the latest release in action [here](https://ratjuggler.github.io/great-pyramid-puzzle/).

Rough timings (time is to first solution):

| Algorithm        | Puzzle / Tiles | Steps      | Time (slow animated) | Time     |
| ---------------- | -------------- | ---------- | -------------------- | -------- |
| Brute Force      | Simple / 4     | 18         | 10 secs              | Instant  |
|                  | Pocket / 16    | 218,842    | ~34 hrs (est)        | 1 secs   |
|                  | Great / 36     | 7,333,769  | ~48 days (est)       | 24 secs  |
| Only Valid Tiles | Simple / 4     | 5          | 3 Secs               | Instant  |
|                  | Pocket / 16    | 20,065     | ~3 hrs 30 mins (est) | Instant  |
|                  | Great / 36     | 12,411,365 | ~87 days (est)       | 152 secs |
| Genetic          | Simple / 4     | ???        | ???                  | ???      |
|                  | Pocket / 16    | ???        | ???                  | ???      |
|                  | Great / 36     | ???        | ???                  | ???      |

## Puzzle Overview
There's an excellent overview of the puzzle on [Jaap's Puzzle Page](https://www.jaapsch.net/puzzles/pyramid.htm) but I'll repeat a
few of the details here.

The puzzle consists of a regular tetrahedral body and 36 loose triangular tiles that are coloured with red and white patterns. 
Each tile has a peg in its centre which fits into holes on the tetrahedron. There are nine tiles on each face. The aim is to cover
the tetrahedron with the tiles such that all the adjacent tiles match along their common edge.

There was also a smaller version, called the Great Pyramid Pocket Puzzle, with 16 tiles and four tiles on each face.

![Image of Great Pyramid](https://raw.githubusercontent.com/RatJuggler/great-pyramid-puzzle/main/images/great-pyramid.jpg)
![Image of Pocket Pyramid](https://raw.githubusercontent.com/RatJuggler/great-pyramid-puzzle/main/images/pocket-pyramid.jpg)

The tiles are regular triangles which are split into 12 segments by six lines, the three bisectors and three lines parallel to the
sides. The four segments along each side are either red or white.

![Image of Tile Segments](https://raw.githubusercontent.com/RatJuggler/great-pyramid-puzzle/main/images/tile-segments.svg)

## Diagrams
These are some diagrams I made while trying to get my head round the problem. They include the layout of a simple test puzzle with
only one tile per side that I'm using to help with testing.

![Image of Tetrahedron Faces](https://raw.githubusercontent.com/RatJuggler/great-pyramid-puzzle/main/images/tetrahedron-faces.svg)

![Image of Tile Positions for Test](https://raw.githubusercontent.com/RatJuggler/great-pyramid-puzzle/main/images/tile-positions-test.svg)

![Image of Test Tile Layout](https://raw.githubusercontent.com/RatJuggler/great-pyramid-puzzle/main/images/tile-test-layout.svg)

![Image of Tile Positions for Pocket](https://raw.githubusercontent.com/RatJuggler/great-pyramid-puzzle/main/images/tile-positions-pocket.svg)

![Image of Tile Positions for Great](https://raw.githubusercontent.com/RatJuggler/great-pyramid-puzzle/main/images/tile-positions-great.svg)

### Resources
- A quick overview on [equilateral triangle](https://en.wikipedia.org/wiki/Equilateral_triangle) geometry.
- [Asymptote](https://asymptote.sourceforge.io/), used to generate the segment, tetrahedron face/side and tile position diagrams.
