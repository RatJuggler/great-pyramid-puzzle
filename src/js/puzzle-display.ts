import display_data from "../display-data.json";
import { TriangleDisplayData, TileDisplayData } from "./puzzle-display-schema"
import { Tile } from "./tile";
import { Face } from "./face";
import { Tetrahedron } from "./tetrahedron";
import { G, Matrix, Svg, SVG } from "@svgdotjs/svg.js";
import {TilePosition} from "./tile-position";


function rotateTile(tile: HTMLElement) {
    // Use the existing element with a new SVG instance.
    const svg = SVG(tile) as Svg;
    svg.rotate(120, 0, 0);
}

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

function drawTilePosition(svg: Svg, tilePosition: TilePosition, rotate: boolean): G {

    // Group and identify the elements showing at a tile position.
    const tileDisplay = svg.group().id(tilePosition.name);
    let hover = "Position: " + tilePosition.name + ", Tile: ";

    // Draw the tile if present.
    if (tilePosition.isEmpty()) {
        hover += "Empty";
    } else {
        hover += tilePosition.tile.id;
        const segments = rotate ? display_data.down_segments : display_data.up_segments;
        drawTile(svg, tileDisplay, segments, tilePosition.tile);
    }

    tileDisplay.element('title').words(hover);

    // Draw the tile position outline.
    const drawTriangle = rotate ? display_data.down_triangle : display_data.up_triangle;
    tileDisplay.add(
        svg.path(drawTriangle)
            .fill(tilePosition.isEmpty() ? '#e6e6e6' : 'none')
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
        const tilePosition = puzzleFace.getTilePosition(tpData.name);
        const tPosition =
            new Matrix(tScale, 0, 0, tScale, (fData.x + tpData.center.x) * fScale, (fData.y + tpData.center.y) * fScale);
        faceDisplay.add(
            drawTilePosition(svg, tilePosition, tpData.center.r === 60).transform(tPosition));
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

export { displayPuzzle, rotateTile }
