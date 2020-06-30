import display_data from "../display-data.json";
import { TriangleDisplayData, TileDisplayData } from "./puzzle-display-schema"
import { Tile } from "./tile";
import { Face } from "./face";
import { Tetrahedron } from "./tetrahedron";
import { G, Matrix, Svg, SVG } from "@svgdotjs/svg.js";


function drawTile(svg: Svg, tileDisplay: G, segments: string[], tile: Tile) {

    // Draw the individual segments.
    for (let segN = 0; segN < segments.length; segN++) {
        tileDisplay.add(
            svg.path(segments[segN])
                .fill(tile.segments.charAt(segN) === '1' ? '#ff0000' : '#ffffff')
                .stroke('none'));
    }

    // Draw the peg in the middle.
    tileDisplay.add(
        svg.circle(0.2)
            .center(0, 0)
            .fill('#bebebe')
            .stroke('none'));
}

function drawTilePosition(svg: Svg, tpName: string, tile: Tile | null, rotate: boolean): G {

    // Group and identify the elements showing at a tile position.
    const tileDisplay = svg.group().id(tpName);
    tileDisplay.element('title').words("Position: " + tpName + ", Tile: " + (tile == null ? "Empty" : tile.id));

    // Draw the tile if present.
    if (tile !== null) {
        const segments = rotate ? display_data.down_segments : display_data.up_segments;
        drawTile(svg, tileDisplay, segments, tile);
    }

    // Draw the tile position outline.
    const drawTriangle = rotate ? display_data.down_triangle : display_data.up_triangle;
    tileDisplay.add(
        svg.path(drawTriangle)
            .fill(tile == null ? '#e6e6e6' : 'none')
            .stroke({width: 0.005, color: '#000000'}));

    return tileDisplay;
}

function drawFace(svg: Svg, fScale: number, fData: TriangleDisplayData, puzzleFace: Face, tileDisplayData: TileDisplayData) {

    const fCenter = {x: fData.x * fScale, y: fData.y * fScale};
    const fPosition = new Matrix(fScale, 0, 0, fScale, fCenter.x, fCenter.y);
    const tScale = fScale * tileDisplayData.tileScale;

    // Group and identify the elements showing on a face.
    const faceDisplay = svg.group().id("face" + puzzleFace.name);
    faceDisplay.element('title').words("Face " + puzzleFace.name);

    // The underlying face.
    faceDisplay.path(display_data.up_triangle)
        .transform(fPosition)
        .fill('#f3f3f3')
        .stroke({width: 0.01, color: '#000000'});

    // Draw the contents of each tile position.
    tileDisplayData.tilePositions.forEach((tpData) => {
        const tile = puzzleFace.getTileAtPosition(tpData.name);
        const tpName = puzzleFace.name + "-" + tpData.name;
        const tPosition =
            new Matrix(tScale, 0, 0, tScale, (fData.x + tpData.center.x) * fScale, (fData.y + tpData.center.y) * fScale);
        faceDisplay.add(
            drawTilePosition(svg, tpName, tile, tpData.center.r === 60)
                .transform(tPosition));
    });

    // Rotate the face if required.
    faceDisplay.rotate(fData.r, fCenter.x, fCenter.y);

    // Draw a point to show the center of the face.
    svg.circle(1)
        .id("center" + puzzleFace.name)
        .center(fCenter.x, fCenter.y)
        .fill('#000000')
        .stroke('none')
        .element('title')
        .words("Center of Face " + puzzleFace.name);
}

function displayPuzzle(rootElement: string | HTMLElement, puzzleToDisplay: Tetrahedron, tileDisplayData: TileDisplayData): Svg {

    // Use an existing root SVG element and clear it.
    const svg = SVG(rootElement) as Svg;
    svg.clear();

    // Then display each face of the puzzle.
    const fScale = display_data.faceDisplay.faceScale;
    display_data.faceDisplay.faces.forEach((displayFace) => {
        const puzzleFace = puzzleToDisplay.getFace(displayFace.name);
        drawFace(svg, fScale, displayFace.center, puzzleFace, tileDisplayData);
    });

    return svg;
}

export { displayPuzzle }
