// Display Events/Changes:
// Initial - Draw an empty puzzle
// Empty - Draw an empty tile position
// Final - Draw a tile at it's final tile position (no animation)
// Place - Animate placing a tile at a tile position
// Rotate - Animate rotating a tile at a tile position
// Remove - Animate removing the tile at a tile position

import { TileChange, TilePositionChange } from "./tile-position-change";
import { DisplayData, FaceDisplayData, CenterPointData } from "./display-data-schema";
import { SVG, Svg, G, Matrix } from "@svgdotjs/svg.js";


class Display {

    private static readonly LINE_COLOUR = '#000000';
    private static readonly FACE_COLOUR = '#808080';
    private static readonly TILE_POSITION_COLOUR = '#C0C0C0';
    private static readonly START_POSITION_COLOUR = '#DCDCDC';
    private static readonly TILE_COLOUR = '#FFFFFF';
    private static readonly SEGMENT_COLOUR = '#FF0000';
    private static readonly PEG_COLOUR = '#BEBEBE';

    private readonly _draw: Svg;
    private readonly _scaleFace: number = this._displayData.faceScale;
    private readonly _scaleTile: number = this._displayData.tileScale * this._displayData.faceScale;
    private readonly _startCenter: CenterPointData = {
        x: -2 * this._scaleFace,
        y: -1 * this._scaleFace,
        r: 0
    };

    constructor(rootElement: string | HTMLElement, private readonly _displayData: DisplayData) {
        // Should be using an existing SVG root element.
        this._draw = SVG(rootElement) as Svg;
    }

    get startCenter(): CenterPointData {
        return this._startCenter;
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
            .stroke({ width: outline, color: Display.LINE_COLOUR});
    }

    drawTile(tpCenter: CenterPointData, tileId: number, rotatedSegments: string): G {
        // Group the elements which make up a tile position.
        const tGroup = this._draw.group().id("tile" + tileId);
        // Fill in the tile colour.
        this.drawTriangle(tGroup, tpCenter, this._scaleTile, Display.TILE_COLOUR, 0);
        // Draw the red segments.
        for (let segN = 0; segN < rotatedSegments.length; segN++) {
            if (rotatedSegments.charAt(segN) === '1') {
                tGroup.polygon(this.scaleSegment(segN, tpCenter, this._scaleTile))
                    .rotate(tpCenter.r, tpCenter.x, tpCenter.y)
                    .fill(Display.SEGMENT_COLOUR)
                    .stroke('none');
            }
        }
        // Outline the tile.
        this.drawTriangle(tGroup, tpCenter, this._scaleTile, 'none');
        // Draw the peg in the middle.
        tGroup.circle(this._displayData.pegScale)
            .center(tpCenter.x, tpCenter.y)
            .fill(Display.PEG_COLOUR)
            .stroke('none');
        return tGroup;
    }

    drawTilePosition(tpGroup: G, tpCenter: CenterPointData, tChange: TileChange): void {
        // Clear any existing tile position drawing.
        tpGroup.clear();
        // Set the tile description.
        const desc = "Position: " + tChange.tilePositionId + ", Tile: " + tChange.tileId;
        tpGroup.element('title').words(desc);
        // Draw the tile.
        tpGroup.add(
            this.drawTile(tpCenter, tChange.tileId, tChange.rotatedSegments)
        );
    }

    drawEmptyTilePosition(tpGroup: G, tpCenter: CenterPointData, tilePositionId: string): void {
        // Clear any existing tile position drawing.
        tpGroup.clear();
        // Set the tile description.
        const desc = "Position: " + tilePositionId + ", Tile: Empty";
        tpGroup.element('title').words(desc);
        // Draw the empty tile position.
        this.drawTriangle(tpGroup, tpCenter, this._scaleTile, Display.TILE_POSITION_COLOUR);
    }

    getTilePosition(tilePositionId: string): { group: G; center: CenterPointData; } {
        const element = this._draw.findOne("[id='" + tilePositionId + "']");
        const group = SVG(element) as G;
        const center = group.dom.tpCenter;
        return {group, center};
    }

    private createTilePosition(tpCenter: CenterPointData, tilePositionId: string): G {
        // Create a group for the elements to be shown at the tile position.
        const tpGroup = this._draw.group().id(tilePositionId).setData({tpCenter: tpCenter});
        // Display an empty tile position.
        this.drawEmptyTilePosition(tpGroup, tpCenter, tilePositionId);
        return tpGroup;
    }

    private createFace(fData: FaceDisplayData): void {
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
        this.drawTriangle(fGroup, fCenter, this._scaleFace, Display.FACE_COLOUR, 0);
        // Draw each tile position on the face.
        fData.tilePositions.forEach((tpData) => {
            // Scale the tile position center point.
            const tpCenter = {
                x: fCenter.x + (tpData.center.x * this._scaleFace),
                y: fCenter.y + (tpData.center.y * this._scaleFace),
                r: fCenter.r + tpData.center.r
            };
            fGroup.add(
                this.createTilePosition(tpCenter, fData.name + '-' + tpData.id)
            );
        });
        // Outline the face.
        this.drawTriangle(fGroup, fCenter, this._scaleFace, 'none', 0.4);
        // Draw a point to show the center of the face last so it always shows up.
        this._draw.circle(1)
            .id("center" + fData.name)
            .center(fCenter.x, fCenter.y)
            .fill(Display.LINE_COLOUR)
            .stroke('none')
            .element('title')
            .words("Center of Face " + fData.name);
    }

    createInitialDisplay(): Svg {
        // Clear any existing display.
        this._draw.clear();
        // Display each face of the puzzle.
        this._displayData.faces.forEach((fData) => this.createFace(fData));
        // Start area group must be created last.
        const startGroup = this._draw.group().id("start");
        startGroup.element('title').words("Next tile to be placed/removed.");
        this.drawTriangle(startGroup, this._startCenter, this._scaleTile, Display.START_POSITION_COLOUR);
        // Return the main element.
        return this._draw;
    }

}


abstract class DisplayChange {

    protected static readonly ANIMATE_DURATION = 500;

    protected constructor(protected readonly display: Display) {}

    abstract show(): void;

}


class EmptyTilePosition extends DisplayChange {

    constructor(display: Display,
                private readonly _tpChange: TilePositionChange) {
        super(display);
    }

    show(): void {
        // Find the tile position to be displayed empty.
        const tpDisplay = this.display.getTilePosition(this._tpChange.tilePositionId);
        // Redraw the empty tile position.
        this.display.drawEmptyTilePosition(tpDisplay.group, tpDisplay.center, this._tpChange.tilePositionId);
    }

}


class FinalTilePosition extends DisplayChange {

    constructor(display: Display,
                private readonly _tChange: TileChange) {
        super(display);
    }

    show(): void {
        // Find the destination tile position of the new tile.
        const tpDisplay = this.display.getTilePosition(this._tChange.tilePositionId);
        // Redraw the tile position with the placed tile.
        this.display.drawTilePosition(tpDisplay.group, tpDisplay.center, this._tChange);
    }

}


class PlaceTilePosition extends DisplayChange {

    constructor(display: Display,
                private readonly _tChange: TileChange) {
        super(display);
    }

    show(): void {
        // Find the destination tile position of the new tile.
        const tpDisplay = this.display.getTilePosition(this._tChange.tilePositionId);
        // Draw the tile to be placed at the starting position.
        const placeTile = this.display.drawTile(this.display.startCenter, this._tChange.tileId, this._tChange.rotatedSegments);
        // Animate the tile moving from the start to the destination.
        const matrix = new Matrix()
            .translate(tpDisplay.center.x - this.display.startCenter.x, tpDisplay.center.y - this.display.startCenter.y)
            .rotate(tpDisplay.center.r, tpDisplay.center.x, tpDisplay.center.y);
        // @ts-ignore
        placeTile.animate({duration: this.ANIMATE_DURATION}).transform(matrix)
            .after(() => {
                // Remove the animated tile then redraw the tile position with the placed tile.
                placeTile.remove();
                this.display.drawTilePosition(tpDisplay.group, tpDisplay.center, this._tChange);
            });
    }

}


class RotateTilePosition extends DisplayChange {

    constructor(display: Display,
                private readonly _tpChange: TilePositionChange) {
        super(display);
    }

    show(): void {
        // Find the tile position of the tile to be rotated.
        const tpDisplay = this.display.getTilePosition(this._tpChange.tilePositionId);
        // Rotate the child tile group.
        const tGroup = SVG(tpDisplay.group.children()[1]) as G;
        // @ts-ignore
        tGroup.animate({duration: this.ANIMATE_DURATION, ease: "<>"}).rotate(120, tpDisplay.center.x, tpDisplay.center.y);
    }

}


class RemoveTilePosition extends DisplayChange {

    constructor(display: Display,
                private readonly _tChange: TileChange) {
        super(display);
    }

    show(): void {
        // Find the tile position of the tile to be removed.
        const tpDisplay = this.display.getTilePosition(this._tChange.tilePositionId);
        // Redraw the tile position with the tile removed then draw the tile at the tile position ready to be animated.
        this.display.drawEmptyTilePosition(tpDisplay.group, tpDisplay.center, this._tChange.tilePositionId);
        const removeTile = this.display.drawTile(this.display.startCenter, this._tChange.tileId, this._tChange.rotatedSegments);
        // Animate the tile moving from it's old position back to the start.
        const matrix = new Matrix()
            .translate(this.display.startCenter.x - tpDisplay.center.x, this.display.startCenter.y - tpDisplay.center.y)
            .rotate(-tpDisplay.center.r, this.display.startCenter.x, this.display.startCenter.y);
        // @ts-ignore
        removeTile.animate({duration: this.ANIMATE_DURATION}).transform(matrix)
            .after(() => {
                // Remove the animated tile.
                removeTile.remove();
            });
    }

}


export class DisplayManager {

    private readonly _display: Display;

    constructor(rootElement: string | HTMLElement, displayData: DisplayData) {
        this._display = new Display(rootElement, displayData)
    }

    initialDisplay(): Svg {
        return this._display.createInitialDisplay();
    }

    display(tpChange: TilePositionChange) {
        let action;
        switch (tpChange.type) {
            case "Empty":
                action = new EmptyTilePosition(this._display, tpChange);
                break;
            case "Final":
                action = new FinalTilePosition(this._display, tpChange as TileChange);
                break;
            case "Place":
                action = new PlaceTilePosition(this._display, tpChange as TileChange);
                break;
            case "Rotate":
                action = new RotateTilePosition(this._display, tpChange);
                break;
            case "Remove":
                action = new RemoveTilePosition(this._display, tpChange as TileChange);
                break;
            default:
                throw new Error("Unknown tile position change!");
        }
        action.show();
    }

}
