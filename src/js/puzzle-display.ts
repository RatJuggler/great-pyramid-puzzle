import { CenterPointData, FaceDisplayData, DisplayData } from "./puzzle-display-schema"
import { Face } from "./face";
import { Tetrahedron } from "./tetrahedron";
import {G, Matrix, Svg, SVG} from "@svgdotjs/svg.js";
import {TilePosition} from "./tile-position";
import {Tile} from "./tile";


export class DisplayManager {

    private readonly _draw: Svg;
    private readonly _scaleTile: number;
    private readonly _ntCenter: CenterPointData;

    constructor(rootElement: string | HTMLElement, private readonly _displayData: DisplayData) {
        // Use an existing root SVG element and clear it.
        this._draw = SVG(rootElement) as Svg;
        this._draw.clear();
        this._scaleTile = this._displayData.tileScale * this._displayData.faceScale;
        this._ntCenter = {
            x: -2 * this._displayData.faceScale,
            y: -1 * this._displayData.faceScale,
            r: 0
        }
    }

    private scaleSegment(segN: number, tpCenter: CenterPointData, scale: number): [number, number][] {
        const scaledSegment: [number, number][] = [];
        this._displayData.segments[segN].forEach(value =>
            scaledSegment.push([tpCenter.x + (scale * value[0]), tpCenter.y + (scale * value[1])]));
        return scaledSegment;
    }

    private scaleTrangle(scale: number): number[] {
        const scaledTriangle: number[] = [];
        this._displayData.triangle.forEach(value => scaledTriangle.push(scale * value));
        return scaledTriangle;
    }

    private drawTriangle(draw: G, tpCenter: CenterPointData, scale: number,
                                fill: string, stroke: { color: string; width: number }): void {
        draw.polygon(this.scaleTrangle(scale))
            .dmove(tpCenter.x, tpCenter.y)
            .rotate(tpCenter.r, tpCenter.x, tpCenter.y)
            .fill(fill)
            .stroke(stroke);
    }

    private drawOutlineTriangle(draw: G, fCenter: CenterPointData, scale: number): void {
        draw.polygon(this.scaleTrangle(scale))
            .dmove(fCenter.x, fCenter.y)
            .rotate(fCenter.r, fCenter.x, fCenter.y)
            .fill('#f3f3f3')
            .stroke({width: 0.4, color: '#000000'});
    }

    private drawTile(tile: Tile, tpCenter: CenterPointData): G {
        const tGroup = this._draw.group().id("tile" + tile.id);
        // Draw a white tile.
        this.drawTriangle(tGroup, tpCenter, this._scaleTile, '#ffffff', {width: 0.2, color: '#000000'});
        // Draw the red segments.
        for (let segN = 0; segN < tile.segments.length; segN++) {
            if (tile.segments.charAt(segN) === '1') {
                const segment = this.scaleSegment(segN, tpCenter, this._scaleTile);
                tGroup.polygon(segment)
                    .fill('#ff0000')
                    .stroke('none');
            }
        }
        // Draw the peg in the middle.
        tGroup.circle(0.2)
            .center(0, 0)
            .fill('#bebebe')
            .stroke('none');
        return tGroup;
    }

    private drawTilePosition(tpGroup: G, tilePosition: TilePosition, tpCenter: CenterPointData): void {
        // Information about the tile position.
        let hover = "Position: " + tilePosition.name + ", Tile: ";
        // Draw the tile if present or an outline if not.
        if (tilePosition.isEmpty()) {
            hover += "Empty";
            this.drawTriangle(tpGroup, tpCenter, this._scaleTile,
                tilePosition.isEmpty() ? '#e6e6e6' : 'none', {width: 0.4, color: '#000000'});
        } else {
            hover += tilePosition.tile.id;
            tpGroup.add(
                this.drawTile(tilePosition.tile, tpCenter)
            );
        }
        // Set the tile description/hover.
        tpGroup.element('title').words(hover);
    }

    private displayTilePosition(tilePosition: TilePosition, tpCenter: CenterPointData): G {
        // Group and identify the elements showing at a tile position.
        const tpGroup = this._draw.group().id(tilePosition.id).setData({tpCenter: tpCenter});
        this.drawTilePosition(tpGroup, tilePosition, tpCenter);
        return tpGroup;
    }

    private displayFace(face: Face, fData: FaceDisplayData): void {
        const fCenter = {
            x: fData.center.x * this._displayData.faceScale,
            y: fData.center.y * this._displayData.faceScale,
            r: fData.center.r
        }
        // Create a group for the elements on a face with an identifier.
        const fGroup = this._draw.group().id(face.id);
        fGroup.element('title').words("Face " + face.name);
        // Then draw the underlying face.
        this.drawOutlineTriangle(fGroup, fCenter, this._displayData.faceScale);
        // Draw each tile position on the face.
        fData.tilePositions.forEach((tpData) => {
            const tilePosition = face.getTilePosition(tpData.id);
            const tpCenter = {
                x: fCenter.x + (tpData.center.x * this._displayData.faceScale),
                y: fCenter.y + (tpData.center.y * this._displayData.faceScale),
                r: fCenter.r + tpData.center.r
            };
            fGroup.add(
                this.displayTilePosition(tilePosition, tpCenter)
            );
        });
        // Draw a point to show the center of the face last so it always shows up.
        this._draw.circle(2)
            .id("center" + face.name)
            .center(fCenter.x, fCenter.y)
            .fill('#000000')
            .stroke('none')
            .element('title')
            .words("Center of Face " + face.name);
    }

    displayPuzzle(puzzleToDisplay: Tetrahedron): Svg {
        // Display each face of the puzzle.
        this._displayData.faces.forEach((fData) => {
            const face = puzzleToDisplay.getFace(fData.id);
            this.displayFace(face, fData)
        });
        // New tile area must be created last.
        // Create a group for the new tile area with an identifier.
        const ntGroup = this._draw.group().id("newtile");
        this.drawOutlineTriangle(ntGroup, this._ntCenter, this._scaleTile);
        return this._draw;
    }

    redrawTilePosition(tilePosition: TilePosition, puzzleDisplay: HTMLElement): void {
        // Find the tile position display to update.
        const tpElement = puzzleDisplay.querySelector("[id='" + tilePosition.id + "']")!;
        const tpGroup = SVG(tpElement) as G;
        const tpCenter = tpGroup.dom.tpCenter;
        tpGroup.clear();
        // this.drawTilePosition(tpGroup, tilePosition, tpCenter, fCenter, scale);
        // Draw the new tile at the starting position.
        const newTile = this.drawTile(tilePosition.tile, this._ntCenter);
        const matrix = new Matrix()
            .translate((tpCenter.x - this._ntCenter.x), (tpCenter.y - this._ntCenter.y))
            .rotate(tpCenter.r, tpCenter.x, tpCenter.y);
        // @ts-ignore
        newTile.animate({duration: 500}).transform(matrix)
            .after(() => {
                tpGroup.add(newTile);
            });
    }

    rotateTile(tpElement: HTMLElement): void {
        // Use the existing element with a new SVG instance.
        const tGroup = SVG(tpElement.children[0]) as G;
        // @ts-ignore
        tGroup.animate({duration: 1000, ease: "<>"}).rotate(120);
    }

}
