import { CenterPointData, FaceDisplayData, DisplayData } from "./display-data-schema"
import { Face } from "./face";
import { Tetrahedron } from "./tetrahedron";
import { TilePosition } from "./tile-position";
import { G, Matrix, Svg, SVG } from "@svgdotjs/svg.js";


export class DisplayManager {

    private readonly _draw: Svg;
    private readonly _scaleFace: number = this._displayData.faceScale;
    private readonly _scaleTile: number = this._displayData.tileScale * this._displayData.faceScale;
    private readonly _ntCenter: CenterPointData = {
        x: -2 * this._scaleFace,
        y: -1 * this._scaleFace,
        r: 0
    };

    constructor(rootElement: string | HTMLElement, private readonly _displayData: DisplayData) {
        // Should be using an existing root SVG element.
        this._draw = SVG(rootElement) as Svg;
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

    private drawTile(tilePosition: TilePosition, tpCenter: CenterPointData): G {
        // Group the elements which make up a tile position.
        const tGroup = this._draw.group().id("tile" + tilePosition.tile.id);
        // Draw a white tile.
        this.drawTriangle(tGroup, tpCenter, this._scaleTile, '#ffffff', {width: 0.2, color: '#000000'});
        // Draw the red segments.
        const segments = tilePosition.getRotatedSegments();
        for (let segN = 0; segN < segments.length; segN++) {
            if (segments.charAt(segN) === '1') {
                tGroup.polygon(this.scaleSegment(segN, tpCenter, this._scaleTile))
                    .rotate(tpCenter.r, tpCenter.x, tpCenter.y)
                    .fill('#ff0000')
                    .stroke('none');
            }
        }
        // Draw the peg in the middle.
        tGroup.circle(this._displayData.pegScale)
            .center(tpCenter.x, tpCenter.y)
            .fill('#bebebe')
            .stroke('none');
        return tGroup;
    }

    private static setTPDescription(tpGroup: G, tilePosition: TilePosition): void {
        // Information about the tile position.
        const desc = "Position: " + tilePosition.name + ", Tile: " + (tilePosition.isEmpty() ? "Empty" : tilePosition.tile.id);
        tpGroup.element('title').words(desc);
    }

    private drawTilePosition(tpGroup: G, tilePosition: TilePosition, tpCenter: CenterPointData): void {
        // Set the tile description.
        DisplayManager.setTPDescription(tpGroup, tilePosition);
        // Draw the tile if present or an outline if not.
        if (tilePosition.isEmpty()) {
            this.drawTriangle(tpGroup, tpCenter, this._scaleTile, '#C0C0C0', {width: 0.4, color: '#000000'});
        } else {
            tpGroup.add(
                this.drawTile(tilePosition, tpCenter)
            );
        }
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
        // Clear any existing display.
        this._draw.clear();
        // Display each face of the puzzle.
        this._displayData.faces.forEach((fData) => {
            const face = puzzleToDisplay.getFace(fData.id);
            this.displayFace(face, fData)
        });
        // New tile area group must be created last.
        const ntGroup = this._draw.group().id("newtile");
        ntGroup.element('title').words("Next tile to be placed.");
        this.drawTriangle(ntGroup, this._ntCenter, this._scaleTile, '#DCDCDC', {width: 0.4, color: '#000000'});
        return this._draw;
    }

    redrawTilePosition(tilePosition: TilePosition): void {
        // Find the tile position display to update.
        const tpElement = this._draw.findOne("[id='" + tilePosition.id + "']");
        const tpGroup = SVG(tpElement) as G;
        const tpCenter = tpGroup.dom.tpCenter;
        tpGroup.clear();
        // Draw the new tile at the starting position.
        const newTile = this.drawTile(tilePosition, this._ntCenter);
        // Animate the tile moving into position.
        const matrix = new Matrix()
            .translateO(tpCenter.x - this._ntCenter.x, tpCenter.y - this._ntCenter.y)
            .rotate(tpCenter.r, tpCenter.x, tpCenter.y);
        // @ts-ignore
        newTile.animate({duration: 500}).transform(matrix)
            .after(() => {
                // Remove the animated tile and redraw the position.
                newTile.remove();
                this.drawTilePosition(tpGroup, tilePosition, tpCenter);
            });
    }

    rotateTile(tpElement: SVGGElement): void {
        const tpGroup = SVG(tpElement) as G;
        const tpCenter = tpGroup.dom.tpCenter;
        // Rotate the child tile group.
        const tGroup = SVG(tpGroup.children()[1]) as G;
        // @ts-ignore
        tGroup.animate({duration: 1000, ease: "<>"}).rotate(120, tpCenter.x, tpCenter.y);
    }

}
