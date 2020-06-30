import display_data from "../display-data.json";
import { TriangleDisplayData, TileDisplayData } from "./puzzle-display-schema"
import { Tile } from "./tile";
import { Face } from "./face";
import { Tetrahedron } from "./tetrahedron";
import { G, Matrix, Svg, SVG } from "@svgdotjs/svg.js";


function drawTile(svg: Svg, tpName: string, tile: Tile | null, rotate: boolean): G {
    const tileSegments = svg.group().id(tpName);
    tileSegments.element('title').words(tpName);
    if (tile !== null) {
        const drawSegments = rotate ? display_data.down_segments : display_data.up_segments;
        for (let segN = 0; segN < drawSegments.length; segN++) {
            tileSegments.add(
                svg.path(drawSegments[segN])
                    .fill(tile.segments.charAt(segN) === '1' ? '#ff0000' : '#ffffff')
                    .stroke('none'));
        }
        tileSegments.add(
            svg.circle(0.2)
                .center(0, 0)
                .fill('#bebebe')
                .stroke('none'));
    }
    const drawTriangle = rotate ? display_data.down_triangle : display_data.up_triangle;
    tileSegments.add(
        svg.path(drawTriangle)
            .fill(tile == null ? '#e6e6e6' : 'none')
            .stroke({width: 0.005, color: '#000000'}));
    return tileSegments;
}

function drawFace(svg: Svg, fScale: number, fData: TriangleDisplayData, puzzleFace: Face, tileDisplayData: TileDisplayData) {
    const fCenter = {x: fData.x * fScale, y: fData.y * fScale};
    const fPosition = new Matrix(fScale, 0, 0, fScale, fCenter.x, fCenter.y);
    const face = svg.group().id("Face " + puzzleFace.name);
    face.element('title').words("Face " + puzzleFace.name);
    face.path(display_data.up_triangle)
        .transform(fPosition)
        .fill('#f3f3f3')
        .stroke({width: 0.01, color: '#000000'});
    const tScale = fScale * tileDisplayData.tileScale;
    tileDisplayData.tilePositions.forEach((tpData) => {
        const tile = puzzleFace.getTileAtPosition(tpData.name);
        const tpName = puzzleFace.name + "-" + tpData.name;
        const tPosition =
            new Matrix(tScale, 0, 0, tScale, (fData.x + tpData.center.x) * fScale, (fData.y + tpData.center.y) * fScale);
        face.add(
            drawTile(svg, tpName, tile, tpData.center.r === 60)
                .transform(tPosition));
    });
    face.rotate(fData.r, fCenter.x, fCenter.y);
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
    // Then display each face of the puzzle,
    display_data.faceDisplay.faces.forEach((displayFace) =>
        drawFace(svg, display_data.faceDisplay.faceScale, displayFace.center, puzzleToDisplay.getFace(displayFace.name), tileDisplayData)
    );
    return svg;
}

export { displayPuzzle }
