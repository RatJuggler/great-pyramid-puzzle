import display_data from "../display-data.json";
import { loadTestPuzzleAndPlaceTiles, loadPocketPuzzleAndPlaceTiles, loadGreatPuzzleAndPlaceTiles } from "./puzzle-loader";
import { Face } from "./face";
import { Tile } from "./tile";
import { Tetrahedron } from "./tetrahedron";
import { SVG, Matrix, G} from "@svgdotjs/svg.js";


const black_line = {width: 0.01, color: '#000000'};

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

const testPuzzleDisplayData = {
    tileScale: 1,
    tilePositions: [
        {
            name: "1",
            center: {x: 0, y: 0, r: 0}
        }
    ]
}

const pocketPuzzleDisplayData = {
    tileScale: 0.5,
    tilePositions: [
        {
            name: "1",
            center: {x: 0, y: -0.5, r: 0}
        },
        {
            name: "2",
            center: {x: -0.433013, y: 0.25, r: 0}
        },
        {
            name: "3",
            center: {x: 0, y: 0.015, r: 60}
        },
        {
            name: "4",
            center: {x: 0.433013, y: 0.25, r: 0}
        }
    ]
}

const greatPuzzleDisplayData = {
    tileScale: 0.32,
    tilePositions: [
        {
            name: "1",
            center: {x: 0, y: -0.333333 * 2, r: 0}
        },
        {
            name: "2",
            center: {x: -0.288675, y: -0.166667, r: 0}
        },
        {
            name: "3",
            center: {x: 0, y: -0.333333, r: 60}
        },
        {
            name: "4",
            center: {x: 0.288675, y: -0.166667, r: 0}
        },
        {
            name: "5",
            center: {x: -0.288675 * 2, y: 0.333333, r: 0}
        },
        {
            name: "6",
            center: {x: -0.288675, y: 0.166667, r: 60}
        },
        {
            name: "7",
            center: {x: 0, y: 0.333333, r: 0}
        },
        {
            name: "8",
            center: {x: 0.288675, y: 0.166667, r: 60}
        },
        {
            name: "9",
            center: {x: 0.288675 * 2, y: 0.333333, r: 0}
        }
    ]
}

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

function drawFace(faceScale: number, fData: TriangleDisplayData, puzzleFace: Face, tileDisplayData: TileDisplayData) {
    const fCenter = {x: fData.x * faceScale, y: fData.y * faceScale, r: fData.r};
    const faceTransform = new Matrix(faceScale, 0, 0, faceScale, fCenter.x, fCenter.y);
    const face = canvas.group();
    face.path(display_data.up_triangle).transform(faceTransform).fill('#f3f3f3').stroke(black_line);
    const tileScale = faceScale * tileDisplayData.tileScale;
    tileDisplayData.tilePositions.forEach((tpData) => {
        const tile = puzzleFace.getTileAtPosition(tpData.name);
        const tTilePosition =
            new Matrix(tileScale, 0, 0, tileScale, (fData.x + tpData.center.x) * faceScale, (fData.y + tpData.center.y) * faceScale);
        face.add(drawTile(tile, tpData.center.r === 60).transform(tTilePosition));
    });
    face.rotate(fData.r, fCenter.x, fCenter.y);
    canvas.circle(4).center(fCenter.x, fCenter.y).fill('#000000').stroke(black_line);
}

function displayPuzzle(puzzleToDisplay: Tetrahedron, tileDisplayData: TileDisplayData) {
    display_data.faceDisplay.faces.forEach((displayFace) =>
        drawFace(display_data.faceDisplay.faceScale, displayFace.center, puzzleToDisplay.getFace(displayFace.name), tileDisplayData)
    );
}

displayPuzzle(loadTestPuzzleAndPlaceTiles(), testPuzzleDisplayData);
// displayPuzzle(loadPocketPuzzleAndPlaceTiles(), pocketPuzzleDisplayData);
// displayPuzzle(loadGreatPuzzleAndPlaceTiles(), greatPuzzleDisplayData);
