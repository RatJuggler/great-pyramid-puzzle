import { CenterPointData, DisplayData } from "./puzzle-display-schema"
import { Tile } from "./tile";
import { TilePosition } from "./tile-position";
import { Face } from "./face";
import { Tetrahedron } from "./tetrahedron";
import { G, Matrix, Svg, SVG } from "@svgdotjs/svg.js";


export class DisplayManager {

    private readonly _svg: Svg;
    private readonly _scaleTile: number = this._displayData.faceScale * this._displayData.tileScale;

    constructor(rootElement: string | HTMLElement, private readonly _displayData: DisplayData) {
        // Use an existing root SVG element and clear it.
        this._svg = SVG(rootElement) as Svg;
        this._svg.clear();
    }

    private drawTile(tileDisplay: G, tile: Tile, rotate: number): void {
        // Draw the individual segments.
        for (let segN = 0; segN < this._displayData.segments.length; segN++) {
            tileDisplay.add(
                this._svg.path(this._displayData.segments[segN])
                    .fill(tile.segments.charAt(segN) === '1' ? '#ff0000' : '#ffffff')
                    .stroke('none')
                    .rotate(rotate, 0, 0));
        }
        // Draw the peg in the middle.
        tileDisplay.add(
            this._svg.circle(0.2)
                .center(0, 0)
                .fill('#bebebe')
                .stroke('none'));
    }

    private drawTilePosition(tilePosition: TilePosition, rotate: number): G {
        // Group and identify the elements showing at a tile position.
        const tileDisplay = this._svg.group().id(tilePosition.name);
        let hover = "Position: " + tilePosition.name + ", Tile: ";
        // Draw the tile if present.
        if (tilePosition.isEmpty()) {
            hover += "Empty";
        } else {
            hover += tilePosition.tile.id;
            this.drawTile(tileDisplay, tilePosition.tile, rotate);
        }
        // Set the tile description/hover.
        tileDisplay.element('title').words(hover);
        // Draw the tile position outline.
        tileDisplay.add(
            this._svg.path(this._displayData.triangle)
                .fill(tilePosition.isEmpty() ? '#e6e6e6' : 'none')
                .stroke({width: 0.005, color: '#000000'})
                .rotate(rotate, 0, 0));
        return tileDisplay;
    }

    private drawFace(fCenter: { x: any; y: any; }, name: string): G {
        const fPosition = new Matrix(this._displayData.faceScale, 0, 0, this._displayData.faceScale, fCenter.x, fCenter.y);
        // Create a group for the elements on a face with an identifier.
        const faceDisplay = this._svg.group().id("face" + name);
        faceDisplay.element('title').words("Face " + name);
        // Then draw the underlying face.
        faceDisplay.path(this._displayData.triangle)
            .transform(fPosition)
            .fill('#f3f3f3')
            .stroke({width: 0.01, color: '#000000'});
        return faceDisplay;
    }

    private displayFace(fData: CenterPointData, puzzleFace: Face) {
        // Determine the center of the face and draw it.
        const fCenter = {x: fData.x * this._displayData.faceScale, y: fData.y * this._displayData.faceScale};
        const faceDisplay = this.drawFace(fCenter, puzzleFace.name);
        // Draw each tile position on the face.
        this._displayData.tilePositions.forEach((tpData) => {
            const tilePosition = puzzleFace.getTilePosition(tpData.id);
            // Build the tile position transform.
            const tPosition =
                new Matrix(this._scaleTile, 0, 0, this._scaleTile,
                    (fData.x + tpData.center.x) * this._displayData.faceScale,
                    (fData.y + tpData.center.y) * this._displayData.faceScale);
            faceDisplay.add(
                this.drawTilePosition(tilePosition, tpData.center.r).transform(tPosition));
        });
        // Rotate the face if required.
        faceDisplay.rotate(fData.r, fCenter.x, fCenter.y);
        // Draw a point to show the center of the face.
        this._svg.circle(1)
            .id("center" + puzzleFace.name)
            .center(fCenter.x, fCenter.y)
            .fill('#000000')
            .stroke('none')
            .element('title')
            .words("Center of Face " + puzzleFace.name);
    }

    displayPuzzle(puzzleToDisplay: Tetrahedron): Svg {
        // Display each face of the puzzle.
        this._displayData.facePositions.forEach((displayFace) => {
            const puzzleFace = puzzleToDisplay.getFace(displayFace.id);
            this.displayFace(displayFace.center, puzzleFace);
        });
        return this._svg;
    }

    rotateTile(tile: HTMLElement): void {
        // Use the existing element with a new SVG instance.
        const svg = SVG(tile) as Svg;
        svg.rotate(120, 0, 0);
    }

}
