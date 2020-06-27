import display_data from "../display-data.json";
import { Tile } from "./tile";
import { Face } from "./face";
import { Tetrahedron } from "./tetrahedron";
import { G, Matrix, SVG } from "@svgdotjs/svg.js";


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

const canvas = SVG().addTo("body").size("100%", "100%").viewbox("-200 -200 400 400");

function drawTile(tile: Tile | null, rotate: boolean): G {
    const tileSegments = canvas.group();
    if (tile == null) {
        const drawTriangle = rotate ? display_data.down_triangle : display_data.up_triangle;
        tileSegments.add(canvas.path(drawTriangle).fill('#e6e6e6').stroke(black_line));
    } else {
        const drawSegments = rotate ? display_data.down_segments : display_data.up_segments;
        for (let segN = 0; segN < drawSegments.length; segN++) {
            tileSegments.add(canvas.path(drawSegments[segN])
                .fill(tile.segments.charAt(segN) === '1' ? '#ff0000' : '#ffffff').stroke('none'));
        }
        tileSegments.add(canvas.circle(0.2).center(0, 0).fill('#bebebe').stroke('none'));
    }
    return tileSegments;
}

function drawFace(fScale: number, fData: TriangleDisplayData, puzzleFace: Face, tileDisplayData: TileDisplayData) {
    const fCenter = {x: fData.x * fScale, y: fData.y * fScale};
    const fPosition = new Matrix(fScale, 0, 0, fScale, fCenter.x, fCenter.y);
    const face = canvas.group();
    face.path(display_data.up_triangle).transform(fPosition).fill('#f3f3f3').stroke(black_line);
    const tScale = fScale * tileDisplayData.tileScale;
    tileDisplayData.tilePositions.forEach((tpData) => {
        const tile = puzzleFace.getTileAtPosition(tpData.name);
        const tPosition =
            new Matrix(tScale, 0, 0, tScale, (fData.x + tpData.center.x) * fScale, (fData.y + tpData.center.y) * fScale);
        face.add(drawTile(tile, tpData.center.r === 60).transform(tPosition));
    });
    face.rotate(fData.r, fCenter.x, fCenter.y);
    canvas.circle(4).center(fCenter.x, fCenter.y).fill('#000000').stroke(black_line);
}

function displayPuzzle(puzzleToDisplay: Tetrahedron, tileDisplayData: TileDisplayData) {
    display_data.faceDisplay.faces.forEach((displayFace) =>
        drawFace(display_data.faceDisplay.faceScale, displayFace.center, puzzleToDisplay.getFace(displayFace.name), tileDisplayData)
    );
}

export { displayPuzzle }
