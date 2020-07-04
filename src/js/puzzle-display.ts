import { CenterPointData, DisplayData } from "./puzzle-display-schema"
import { Tile } from "./tile";
import { TilePosition } from "./tile-position";
import { Face } from "./face";
import { Tetrahedron } from "./tetrahedron";
import { G, Matrix, Svg, SVG } from "@svgdotjs/svg.js";


export class DisplayManager {

    private readonly _svg: Svg;
    private readonly _scaleTile: number = this._displayData.faceScale * this._displayData.tileScale;
    private readonly _newTileStart =
        new Matrix(this._scaleTile, 0, 0, this._scaleTile,
            -1.8 * this._displayData.faceScale,
            -1.05 * this._displayData.faceScale);
    private _ntGroup: G | null = null;

    constructor(rootElement: string | HTMLElement, private readonly _displayData: DisplayData) {
        // Use an existing root SVG element and clear it.
        this._svg = SVG(rootElement) as Svg;
        this._svg.clear();
    }

    private drawTile(tile: Tile): G {
        // Group and identify the components of a tile.
        const tGroup = this._svg.group().id("tile" + tile.id);
        // Draw the individual segments.
        for (let segN = 0; segN < this._displayData.segments.length; segN++) {
            tGroup.add(
                this._svg.path(this._displayData.segments[segN])
                    .fill(tile.segments.charAt(segN) === '1' ? '#ff0000' : '#ffffff')
                    .stroke('none'));
        }
        // Draw the tile outline.
        tGroup.add(
            this._svg.path(this._displayData.triangle)
                .fill('none')
                .stroke({width: 0.005, color: '#000000'}));
        // Draw the peg in the middle.
        tGroup.add(
            this._svg.circle(0.2)
                .center(0, 0)
                .fill('#bebebe')
                .stroke('none'));
        return tGroup;
    }

    private drawTilePosition(tpGroup: G, tilePosition: TilePosition, rotate: number): G {
        // Information about the tile position.
        let hover = "Position: " + tilePosition.name + ", Tile: ";
        // Draw the tile if present.
        if (tilePosition.isEmpty()) {
            hover += "Empty";
        } else {
            hover += tilePosition.tile.id;
            tpGroup.add(this.drawTile(tilePosition.tile));
        }
        // Set the tile description/hover.
        tpGroup.element('title').words(hover);
        // Draw the tile position outline.
        tpGroup.add(
            this._svg.path(this._displayData.triangle)
                .fill(tilePosition.isEmpty() ? '#e6e6e6' : 'none')
                .stroke({width: 0.005, color: '#000000'}));
        return tpGroup.rotate(rotate, 0, 0);
    }

    private displayTilePosition(tilePosition: TilePosition, fData: CenterPointData, tpData: CenterPointData): G {
        // Build the tile position transform.
        const tPosition =
            new Matrix(this._scaleTile, 0, 0, this._scaleTile,
                (fData.x + tpData.x) * this._displayData.faceScale,
                (fData.y + tpData.y) * this._displayData.faceScale);
        // Group and identify the elements showing at a tile position.
        const tpGroup = this._svg.group().id(tilePosition.id).setData({rotate: tpData.r});
        // Draw tile position
        this.drawTilePosition(tpGroup, tilePosition, tpData.r);
        return tpGroup.transform(tPosition).rotate(tpData.r, 0, 0);
    }

    private drawFace(fCenter: { x: any; y: any; }, face: Face): G {
        const fPosition =
            new Matrix(this._displayData.faceScale, 0, 0, this._displayData.faceScale, fCenter.x, fCenter.y);
        // Create a group for the elements on a face with an identifier.
        const fGroup = this._svg.group().id(face.id);
        fGroup.element('title').words("Face " + face.name);
        // Then draw the underlying face.
        fGroup.path(this._displayData.triangle)
            .transform(fPosition)
            .fill('#f3f3f3')
            .stroke({width: 0.01, color: '#000000'});
        return fGroup;
    }

    private displayFace(fData: CenterPointData, face: Face) {
        // Determine the center of the face and draw it.
        const fCenter = {
            x: fData.x * this._displayData.faceScale,
            y: fData.y * this._displayData.faceScale
        };
        const fGroup = this.drawFace(fCenter, face);
        // Draw each tile position on the face.
        this._displayData.tilePositions.forEach((tpData) => {
            const tilePosition = face.getTilePosition(tpData.id);
            fGroup.add(this.displayTilePosition(tilePosition, fData, tpData.center));
        });
        // Rotate the face if required.
        fGroup.rotate(fData.r, fCenter.x, fCenter.y);
        // Draw a point to show the center of the face.
        this._svg.circle(1)
            .id("center" + face.name)
            .center(fCenter.x, fCenter.y)
            .fill('#000000')
            .stroke('none')
            .element('title')
            .words("Center of Face " + face.name);
    }

    displayPuzzle(puzzleToDisplay: Tetrahedron): Svg {
        // Display each face of the puzzle.
        this._displayData.facePositions.forEach((displayFace) => {
            const puzzleFace = puzzleToDisplay.getFace(displayFace.id);
            this.displayFace(displayFace.center, puzzleFace);
        });
        // New puzzle area must be create last.
        this._ntGroup = this._svg.group().id("newtile");
        return this._svg;
    }

    redrawTilePosition(tilePosition: TilePosition, puzzleDisplay: HTMLElement): void {
        // Find the tile position display to update.
        const tpElement = puzzleDisplay.querySelector("[id='" + tilePosition.id + "']")!;
        const tpGroup = SVG(tpElement) as G;
        // Draw the new tile at the starting position.
        const tGroup = this.drawTile(tilePosition.tile).transform(this._newTileStart);
        this._ntGroup!.add(tGroup);
        // @ts-ignore
        tGroup.animate({duration: 1000, ease: "<>"}).transform(tpGroup.matrix()).after(() => {
            tGroup.rotate(tpGroup.dom.rotate, 0, 0);
            this._ntGroup!.clear()
            // Draw the new tile at it's final position.
            tpGroup.clear();
            tpGroup.add(this.drawTile(tilePosition.tile));
        });
    }

    rotateTile(tile: HTMLElement): void {
        // Use the existing element with a new SVG instance.
        const svg = SVG(tile) as Svg;
        // @ts-ignore
        svg.animate({duration: 1000, ease: "<>"}).rotate(120, 0, 0);
    }

}
