import { CenterPointData, FaceDisplayData, DisplayData } from "./display-data-schema"
import { Face } from "./face";
import { Tetrahedron } from "./tetrahedron";
import { TilePosition } from "./tile-position";
import { G, Matrix, Svg, SVG } from "@svgdotjs/svg.js";


export class DisplayManager {

    private static readonly ANIMATE_DURATION = 500;

    private readonly _draw: Svg;
    private readonly _scaleFace: number = this._displayData.faceScale;
    private readonly _scaleTile: number = this._displayData.tileScale * this._displayData.faceScale;
    private readonly _startCenter: CenterPointData = {
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

    private drawTriangle(draw: G, tpCenter: CenterPointData, scale: number, fill: string, outline: number): void {
        draw.polygon(this.scaleTriangle(scale))
            .dmove(tpCenter.x, tpCenter.y)
            .rotate(tpCenter.r, tpCenter.x, tpCenter.y)
            .fill(fill)
            .stroke({ width: outline, color: '#000000'});
    }

    private drawTile(tilePosition: TilePosition, tpCenter: CenterPointData): G {
        // Group the elements which make up a tile position.
        const tGroup = this._draw.group().id("tile" + tilePosition.tile.id);
        // Draw a white tile.
        this.drawTriangle(tGroup, tpCenter, this._scaleTile, '#FFFFFF', 0.2);
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

    private drawTilePosition(tpGroup: G, tilePosition: TilePosition, tpCenter: CenterPointData): void {
        // Clear any existing tile position drawing.
        tpGroup.clear();
        // Set the tile description.
        const desc = "Position: " + tilePosition.name + ", Tile: " + (tilePosition.isEmpty() ? "Empty" : tilePosition.tile.id);
        tpGroup.element('title').words(desc);
        // Draw the tile if present or an outline if not.
        if (tilePosition.isEmpty()) {
            this.drawTriangle(tpGroup, tpCenter, this._scaleTile, '#C0C0C0', 0.2);
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
        const fGroup = this._draw.group().id("face" + fData.name);
        fGroup.element('title').words("Face " + fData.name);
        this.drawTriangle(fGroup, fCenter, this._scaleFace, '#808080', 0);
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
        // Draw an outline.
        this.drawTriangle(fGroup, fCenter, this._scaleFace, 'none', 0.2);
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
            const face = puzzleToDisplay.getFace(fData.name);
            this.displayFace(face, fData)
        });
        // New tile area group must be created last.
        const ntGroup = this._draw.group().id("newtile");
        ntGroup.element('title').words("Next tile to be placed/removed.");
        this.drawTriangle(ntGroup, this._startCenter, this._scaleTile, '#DCDCDC', 0.2);
        return this._draw;
    }

    animatePlaceTile(tilePosition: TilePosition): void {
        // Find the destination tile position of the new tile.
        const tpElement = this._draw.findOne("[id='" + tilePosition.id + "']");
        const tpGroup = SVG(tpElement) as G;
        const tpCenter = tpGroup.dom.tpCenter;
        // Draw the tile to be placed at the starting position.
        const placeTile = this.drawTile(tilePosition, this._startCenter);
        // Animate the tile moving from the start to the destination.
        const matrix = new Matrix()
            .translate(tpCenter.x - this._startCenter.x, tpCenter.y - this._startCenter.y)
            .rotate(tpCenter.r, tpCenter.x, tpCenter.y);
        // @ts-ignore
        placeTile.animate({duration: DisplayManager.ANIMATE_DURATION}).transform(matrix)
            .after(() => {
                // Remove the animated tile then redraw the tile position with the placed tile.
                placeTile.remove();
                this.drawTilePosition(tpGroup, tilePosition, tpCenter);
            });
    }

    animateRemoveTile(tilePosition: TilePosition): void {
        // Find the tile position of the new tile to be removed.
        const tpElement = this._draw.findOne("[id='" + tilePosition.id + "']");
        const tpGroup = SVG(tpElement) as G;
        const tpCenter = tpGroup.dom.tpCenter;
        // Redraw the tile position without the removed tile then draw the tile to be removed at it's old tile position.
        this.drawTilePosition(tpGroup, tilePosition, tpCenter);
        const removeTile = this.drawTile(tilePosition, this._startCenter);
        // Animate the tile moving from it's old position back to the start.
        const matrix = new Matrix()
            .translate(this._startCenter.x - tpCenter.x, this._startCenter.y - tpCenter.y)
            .rotate(-tpCenter.r, this._startCenter.x, this._startCenter.y);
        // @ts-ignore
        removeTile.animate({duration: DisplayManager.ANIMATE_DURATION}).transform(matrix)
            .after(() => {
                // Remove the animated tile.
                removeTile.remove();
            });
    }

    animateRotateTile(tpElement: SVGGElement): void {
        const tpGroup = SVG(tpElement) as G;
        const tpCenter = tpGroup.dom.tpCenter;
        // Rotate the child tile group.
        const tGroup = SVG(tpGroup.children()[1]) as G;
        // @ts-ignore
        tGroup.animate({duration: DisplayManager.ANIMATE_DURATION, ease: "<>"}).rotate(120, tpCenter.x, tpCenter.y);
    }

}
