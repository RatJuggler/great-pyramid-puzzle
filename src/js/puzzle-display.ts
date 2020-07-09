import { CenterPointData, FaceDisplayData, DisplayData } from "./puzzle-display-schema"
import { Face } from "./face";
import { Tetrahedron } from "./tetrahedron";
import {G, Matrix, Svg, SVG} from "@svgdotjs/svg.js";
import {TilePosition} from "./tile-position";
import {Tile} from "./tile";


export class DisplayManager {

    private readonly _draw: Svg;
    private readonly _scaleFace: number;
    private readonly _scaleTile: number;
    private readonly _ntCenter: CenterPointData;

    constructor(rootElement: string | HTMLElement, private readonly _displayData: DisplayData) {
        // Use an existing root SVG element and clear it.
        this._draw = SVG(rootElement) as Svg;
        this._draw.clear();
        this._scaleFace = this._displayData.faceScale;
        this._scaleTile = this._displayData.tileScale * this._displayData.faceScale;
        this._ntCenter = {
            x: -2 * this._scaleFace,
            y: -1 * this._scaleFace,
            r: 0
        }
    }

    private scaleSegment(segN: number, tpCenter: CenterPointData, scale: number): [number, number][] {
        const scaledSegment: [number, number][] = [];
        this._displayData.segments[segN].forEach(value =>
            scaledSegment.push([tpCenter.x + (scale * value[0]), tpCenter.y + (scale * value[1])]));
        return scaledSegment;
    }

    private scaleTriangle(scale: number): number[] {
        const scaledTriangle: number[] = [];
        this._displayData.triangle.forEach(value => scaledTriangle.push(scale * value));
        return scaledTriangle;
    }

    private drawTriangle(draw: G, tpCenter: CenterPointData, scale: number,
                         fill: string, stroke: { color: string; width: number }): void {
        draw.polygon(this.scaleTriangle(scale))
            .dmove(tpCenter.x, tpCenter.y)
            .rotate(tpCenter.r, tpCenter.x, tpCenter.y)
            .fill(fill)
            .stroke(stroke);
    }

    private drawTile(tile: Tile, tpCenter: CenterPointData): G {
        // Group the elements which make up a tile position.
        const tGroup = this._draw.group().id("tile" + tile.id);
        // Draw a white tile.
        this.drawTriangle(tGroup, tpCenter, this._scaleTile, '#ffffff', {width: 0.2, color: '#000000'});
        // Draw the red segments.
        for (let segN = 0; segN < tile.segments.length; segN++) {
            if (tile.segments.charAt(segN) === '1') {
                tGroup.polygon(this.scaleSegment(segN, tpCenter, this._scaleTile))
                    .fill('#ff0000')
                    .stroke('none');
            }
        }
        // Draw the peg in the middle.
        tGroup.circle(5)
            .center(tpCenter.x, tpCenter.y)
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
            this.drawTriangle(tpGroup, tpCenter, this._scaleTile, '#C0C0C0', {width: 0.4, color: '#000000'});
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
        // Group the elements showing at a tile position.
        const tpGroup = this._draw.group().id(tilePosition.id).setData({tpCenter: tpCenter});
        this.drawTilePosition(tpGroup, tilePosition, tpCenter);
        return tpGroup;
    }

    private displayFace(face: Face, fData: FaceDisplayData): void {
        // Scale the face center point.
        const fCenter = {
            x: fData.center.x * this._scaleFace,
            y: fData.center.y * this._scaleFace,
            r: fData.center.r
        }
        // Create a group for the elements on a face.
        const fGroup = this._draw.group().id(face.id);
        fGroup.element('title').words("Face " + face.name);
        this.drawTriangle(fGroup, fCenter, this._scaleFace, '#808080', {width: 0.4, color: '#000000'});
        // Draw each tile position on the face.
        fData.tilePositions.forEach((tpData) => {
            // Scale the tile position center point.
            const tpCenter = {
                x: fCenter.x + (tpData.center.x * this._scaleFace),
                y: fCenter.y + (tpData.center.y * this._scaleFace),
                r: fCenter.r + tpData.center.r
            };
            fGroup.add(
                this.displayTilePosition(face.getTilePosition(tpData.id), tpCenter)
            );
        });
        // Draw a point to show the center of the face last so it always shows up.
        this._draw.circle(1)
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
        // New tile area group must be created last.
        const ntGroup = this._draw.group().id("newtile");
        this.drawTriangle(ntGroup, this._ntCenter, this._scaleTile, '#DCDCDC', {width: 0.4, color: '#000000'});
        return this._draw;
    }

    redrawTilePosition(tilePosition: TilePosition, puzzleDisplay: HTMLElement): void {
        // Find the tile position display to update.
        const tpElement = puzzleDisplay.querySelector("[id='" + tilePosition.id + "']")!;
        const tpGroup = SVG(tpElement) as G;
        const tpCenter = tpGroup.dom.tpCenter;
        tpGroup.clear();
        // Draw the new tile at the starting position.
        const newTile = this.drawTile(tilePosition.tile, this._ntCenter);
        // Animate the tile moving into position.
        const matrix = new Matrix()
            .translate(tpCenter.x - this._ntCenter.x, tpCenter.y - this._ntCenter.y)
            .rotate(tpCenter.r, tpCenter.x, tpCenter.y);
        // @ts-ignore
        newTile.animate({duration: 500}).transform(matrix)
            .after(() => {
                tpGroup.add(newTile);
            });
    }

    rotateTile(tpElement: HTMLElement): void {
        // Rotate the child tile group.
        const tGroup = SVG(tpElement.children[0]) as G;
        // @ts-ignore
        tGroup.animate({duration: 1000, ease: "<>"}).rotate(120, this._ntCenter.x, this._ntCenter.y);
    }

}
