import {CenterPointData, FaceDisplayData, DisplayData } from "./display-data-schema";
import { TilePosition } from "./tile-position";
import { DisplayChange } from "./display-change";
import { G, Matrix, Svg, SVG } from "@svgdotjs/svg.js";


export class DisplayManager {

    private static readonly LINE_COLOUR = '#000000';
    private static readonly FACE_COLOUR = '#808080';
    private static readonly TILE_POSITION_COLOUR = '#C0C0C0';
    private static readonly START_POSITION_COLOUR = '#DCDCDC';
    private static readonly TILE_COLOUR = '#FFFFFF';
    private static readonly SEGMENT_COLOUR = '#FF0000';
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

    private drawTriangle(draw: G, tpCenter: CenterPointData, scale: number, fill: string, outline: number = 0.2): void {
        draw.polygon(this.scaleTriangle(scale))
            .dmove(tpCenter.x, tpCenter.y)
            .rotate(tpCenter.r, tpCenter.x, tpCenter.y)
            .fill(fill)
            .stroke({ width: outline, color: DisplayManager.LINE_COLOUR});
    }

    private drawTile(tpChange: DisplayChange, tpCenter: CenterPointData): G {
        // Group the elements which make up a tile position.
        const tGroup = this._draw.group().id("tile" + tpChange.tileId);
        // Fill in the tile colour.
        this.drawTriangle(tGroup, tpCenter, this._scaleTile, DisplayManager.TILE_COLOUR, 0);
        // Draw the red segments.
        const segments = tpChange.rotatedSegments!;
        for (let segN = 0; segN < segments.length; segN++) {
            if (segments.charAt(segN) === '1') {
                tGroup.polygon(this.scaleSegment(segN, tpCenter, this._scaleTile))
                    .rotate(tpCenter.r, tpCenter.x, tpCenter.y)
                    .fill(DisplayManager.SEGMENT_COLOUR)
                    .stroke('none');
            }
        }
        // Outline the tile.
        this.drawTriangle(tGroup, tpCenter, this._scaleTile, 'none');
        // Draw the peg in the middle.
        tGroup.circle(this._displayData.pegScale)
            .center(tpCenter.x, tpCenter.y)
            .fill('#bebebe')
            .stroke('none');
        return tGroup;
    }

    private drawTilePosition(tpGroup: G, tpChange: DisplayChange, tpCenter: CenterPointData): void {
        // Clear any existing tile position drawing.
        tpGroup.clear();
        // Set the tile description.
        const desc = "Position: " + tpChange.tilePositionId + ", Tile: " + (tpChange.empty ? "Empty" : tpChange.tileId);
        tpGroup.element('title').words(desc);
        // Draw the tile if present or an empty tile position if not.
        if (tpChange.empty) {
            this.drawTriangle(tpGroup, tpCenter, this._scaleTile, DisplayManager.TILE_POSITION_COLOUR);
        } else {
            tpGroup.add(
                this.drawTile(tpChange, tpCenter)
            );
        }
    }

    private displayEmptyTilePosition(tilePositionId: string, tpCenter: CenterPointData): G {
        // Create a group for the elements to be shown at the tile position.
        const tpGroup = this._draw.group().id(tilePositionId).setData({tpCenter: tpCenter});
        // Display an empty tile position.
        const tpChange = {
            eventType: "Test",
            tilePositionId: tilePositionId,
            empty: true,
            tileId: null,
            rotatedSegments: null

        }
        this.drawTilePosition(tpGroup, tpChange, tpCenter);
        return tpGroup;
    }

    private displayEmptyFace(fData: FaceDisplayData): void {
        // Scale the face center point.
        const fCenter = {
            x: fData.center.x * this._scaleFace,
            y: fData.center.y * this._scaleFace,
            r: fData.center.r
        }
        // Create a group for the elements on a face.
        const fGroup = this._draw.group().id("face" + fData.name);
        fGroup.element('title').words("Face " + fData.name);
        // Fill in the face colour.
        this.drawTriangle(fGroup, fCenter, this._scaleFace, DisplayManager.FACE_COLOUR, 0);
        // Draw each tile position on the face.
        fData.tilePositions.forEach((tpData) => {
            // Scale the tile position center point.
            const tpCenter = {
                x: fCenter.x + (tpData.center.x * this._scaleFace),
                y: fCenter.y + (tpData.center.y * this._scaleFace),
                r: fCenter.r + tpData.center.r
            };
            fGroup.add(
                this.displayEmptyTilePosition(fData.name + '-' + tpData.id, tpCenter)
            );
        });
        // Outline the face.
        this.drawTriangle(fGroup, fCenter, this._scaleFace, 'none', 0.4);
        // Draw a point to show the center of the face last so it always shows up.
        this._draw.circle(1)
            .id("center" + fData.name)
            .center(fCenter.x, fCenter.y)
            .fill('#000000')
            .stroke('none')
            .element('title')
            .words("Center of Face " + fData.name);
    }

    displayEmptyPuzzle(): Svg {
        // Clear any existing display.
        this._draw.clear();
        // Display each face of the puzzle.
        this._displayData.faces.forEach((fData) => {
            this.displayEmptyFace(fData)
        });
        // New tile area group must be created last.
        const ntGroup = this._draw.group().id("newtile");
        ntGroup.element('title').words("Next tile to be placed/removed.");
        this.drawTriangle(ntGroup, this._startCenter, this._scaleTile, DisplayManager.START_POSITION_COLOUR);
        return this._draw;
    }

    private getTilePosition(tilePositionId: string): { group: G; center: CenterPointData; } {
        const element = this._draw.findOne("[id='" + tilePositionId + "']");
        const group = SVG(element) as G;
        const center = group.dom.tpCenter;
        return {group, center};
    }

    private static buildTilePositionChange(tilePosition: TilePosition): DisplayChange {
        return {
            eventType: "Test",
            tilePositionId: tilePosition.id,
            empty: tilePosition.isEmpty(),
            tileId: tilePosition.isEmpty() ? null : tilePosition.tile.id,
            rotatedSegments: tilePosition.isEmpty() ? null : tilePosition.getRotatedSegments()
        }
    }

    displayTilePositions(tilePositions: Array<TilePosition>): void {
        tilePositions.forEach((tilePosition) => {
            const tpChange = DisplayManager.buildTilePositionChange(tilePosition);
            this.placeTile(tpChange)
        });
    }

    placeTile(tpChange: DisplayChange): void {
        // Find the destination tile position of the new tile.
        const tpDisplay = this.getTilePosition(tpChange.tilePositionId);
        // Redraw the tile position with the placed tile.
        this.drawTilePosition(tpDisplay.group, tpChange, tpDisplay.center);
    }

    animatePlaceTile(tilePosition: TilePosition): void {
        const tpChange = DisplayManager.buildTilePositionChange(tilePosition);
        // Find the destination tile position of the new tile.
        const tpDisplay = this.getTilePosition(tpChange.tilePositionId);
        // Draw the tile to be placed at the starting position.
        const placeTile = this.drawTile(tpChange, this._startCenter);
        // Animate the tile moving from the start to the destination.
        const matrix = new Matrix()
            .translate(tpDisplay.center.x - this._startCenter.x, tpDisplay.center.y - this._startCenter.y)
            .rotate(tpDisplay.center.r, tpDisplay.center.x, tpDisplay.center.y);
        // @ts-ignore
        placeTile.animate({duration: DisplayManager.ANIMATE_DURATION}).transform(matrix)
            .after(() => {
                // Remove the animated tile then redraw the tile position with the placed tile.
                placeTile.remove();
                this.drawTilePosition(tpDisplay.group, tpChange, tpDisplay.center);
            });
    }

    removeTile(tpChange: DisplayChange): void {
        // Find the tile position of the tile to be removed.
        const tpDisplay = this.getTilePosition(tpChange.tilePositionId);
        // Redraw the tile position with the tile removed.
        this.drawTilePosition(tpDisplay.group, tpChange, tpDisplay.center);
    }

    animateRemoveTile(tpChange: DisplayChange): void {
        // Find the tile position of the tile to be removed.
        const tpDisplay = this.getTilePosition(tpChange.tilePositionId);
        // Redraw the tile position with the tile removed then draw the tile at the tile position ready to be animated.
        this.drawTilePosition(tpDisplay.group, tpChange, tpDisplay.center);
        const removeTile = this.drawTile(tpChange, this._startCenter);
        // Animate the tile moving from it's old position back to the start.
        const matrix = new Matrix()
            .translate(this._startCenter.x - tpDisplay.center.x, this._startCenter.y - tpDisplay.center.y)
            .rotate(-tpDisplay.center.r, this._startCenter.x, this._startCenter.y);
        // @ts-ignore
        removeTile.animate({duration: DisplayManager.ANIMATE_DURATION}).transform(matrix)
            .after(() => {
                // Remove the animated tile.
                removeTile.remove();
            });
    }

    animateRotateTile(tilePositionId: string): void {
        // Find the tile position of the tile to be rotated.
        const tpDisplay = this.getTilePosition(tilePositionId);
        // Rotate the child tile group.
        const tGroup = SVG(tpDisplay.group.children()[1]) as G;
        // @ts-ignore
        tGroup.animate({duration: DisplayManager.ANIMATE_DURATION, ease: "<>"}).rotate(120, tpDisplay.center.x, tpDisplay.center.y);
    }

}
