import display_data from "../display-data.json";
import { Tile } from "./tile";
import { Face } from "./face";
import { Tetrahedron } from "./tetrahedron";
import {G, Matrix, Svg, SVG} from "@svgdotjs/svg.js";


interface TriangleDisplayData {
    readonly x: number,
    readonly y: number,
    readonly r: number,
}

interface PositionDisplayData {
    readonly name: string,
    readonly center: TriangleDisplayData
}

interface TileDisplayData {
    readonly tileScale: number,
    readonly tilePositions: PositionDisplayData[];
}


const black_line = {width: 0.01, color: '#000000'};

function drawTile(svg: Svg, tile: Tile | null, rotate: boolean): G {
    const tileSegments = svg.group();
    if (tile == null) {
        const drawTriangle = rotate ? display_data.down_triangle : display_data.up_triangle;
        tileSegments.add(svg.path(drawTriangle).fill('#e6e6e6').stroke(black_line));
    } else {
        const drawSegments = rotate ? display_data.down_segments : display_data.up_segments;
        for (let segN = 0; segN < drawSegments.length; segN++) {
            tileSegments.add(svg.path(drawSegments[segN])
                .fill(tile.segments.charAt(segN) === '1' ? '#ff0000' : '#ffffff').stroke('none'));
        }
        tileSegments.add(svg.circle(0.2).center(0, 0).fill('#bebebe').stroke('none'));
    }
    return tileSegments;
}

function drawFace(svg: Svg, fScale: number, fData: TriangleDisplayData, puzzleFace: Face, tileDisplayData: TileDisplayData) {
    const fCenter = {x: fData.x * fScale, y: fData.y * fScale};
    const fPosition = new Matrix(fScale, 0, 0, fScale, fCenter.x, fCenter.y);
    const face = svg.group();
    face.path(display_data.up_triangle).transform(fPosition).fill('#f3f3f3').stroke(black_line);
    const tScale = fScale * tileDisplayData.tileScale;
    tileDisplayData.tilePositions.forEach((tpData) => {
        const tile = puzzleFace.getTileAtPosition(tpData.name);
        const tPosition =
            new Matrix(tScale, 0, 0, tScale, (fData.x + tpData.center.x) * fScale, (fData.y + tpData.center.y) * fScale);
        face.add(drawTile(svg, tile, tpData.center.r === 60).transform(tPosition));
    });
    face.rotate(fData.r, fCenter.x, fCenter.y);
    svg.circle(1).center(fCenter.x, fCenter.y).fill('#000000').stroke(black_line);
}

function displayPuzzle(puzzleToDisplay: Tetrahedron, tileDisplayData: TileDisplayData) {
    // Select the existing root SVG element and clear it.
    const svg = SVG("#puzzle-display") as Svg;
    svg.clear();
    display_data.faceDisplay.faces.forEach((displayFace) =>
        drawFace(svg, display_data.faceDisplay.faceScale, displayFace.center, puzzleToDisplay.getFace(displayFace.name), tileDisplayData)
    );
}

export { displayPuzzle }
