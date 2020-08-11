import {TileChange, TilePositionChange} from "../puzzle-changes";
import { DisplayData, FaceDisplayData, TileStartDisplayData, CenterPointData, PolygonDisplayData } from "./display-data-schema";
import { SVG, Svg, G } from "@svgdotjs/svg.js";


type PositionData = {
    group: G,
    center: CenterPointData
}

export class Display {

    private static readonly LINE_COLOUR = '#000000';
    private static readonly FACE_COLOUR = '#808080';
    private static readonly TILE_POSITION_COLOUR = '#C0C0C0';
    private static readonly START_POSITION_COLOUR = '#DCDCDC';
    private static readonly TILE_COLOUR = '#FFFFFF';
    private static readonly SEGMENT_COLOUR = '#FF0000';
    private static readonly PEG_COLOUR = '#BEBEBE';

    private readonly _draw: Svg;

    constructor(rootElement: string | SVGSVGElement, private readonly _displayData: DisplayData) {
        // Should be using an existing SVG root element.
        this._draw = SVG(rootElement) as Svg;
    }

    private static drawPolygon(position: PositionData, polygon: PolygonDisplayData,
                        scale: number, fill: string, stroke: any, rotations: number = 0): void {
        position.group.polygon(polygon)
            .dmove(position.center.x, position.center.y)
            .rotate(position.center.r  + (rotations * 120), position.center.x, position.center.y)
            .fill(fill)
            .stroke(stroke)
            .scale(scale, scale, position.center.x, position.center.y);
    }

    private drawTriangle(tpDisplay: PositionData, scale: number, fill: string, outline: number = 0.01): void {
        Display.drawPolygon(tpDisplay, this._displayData.triangle,
            scale, fill, { width: outline, color: Display.LINE_COLOUR})
    }

    private drawSegment(tpDisplay: PositionData, segN: number, rotations: number, scale: number): void {
        Display.drawPolygon(tpDisplay, this._displayData.segments[segN],
            scale, Display.SEGMENT_COLOUR, 'none', rotations);
    }

    drawTile(tpCenter: CenterPointData, tChange: TileChange, scaleTile: number, rotations: number): G {
        // Create the display for a tile under a single group.
        const tDisplay = {
            group: this._draw.group().id("tile" + tChange.tileId),
            center: tpCenter
        }
        // Set the tile description.
        tDisplay.group.element('title').words("Tile: " + tChange.tileId);
        // Draw a triangle in the base tile colour.
        this.drawTriangle(tDisplay, scaleTile, Display.TILE_COLOUR, 0);
        // Draw the red segments.
        for (let segN = 0; segN < tChange.segments.length; segN++) {
            if (tChange.segments.charAt(segN) === '1') {
                this.drawSegment(tDisplay, segN, rotations, scaleTile);
            }
        }
        // Outline the tile.
        this.drawTriangle(tDisplay, scaleTile, 'none');
        // Draw the peg in the middle.
        tDisplay.group.circle(this._displayData.pegScale)
            .center(tpCenter.x, tpCenter.y)
            .fill(Display.PEG_COLOUR)
            .stroke('none')
            .scale(scaleTile, scaleTile, tpCenter.x, tpCenter.y);
        return tDisplay.group;
    }

    private drawTileAtPosition(tpDisplay: PositionData, positionText: string, tChange: TileChange, scaleTile: number): void {
        // Clear any existing tile position drawing.
        tpDisplay.group.clear();
        // Set the tile position description.
        tpDisplay.group.element('title').words(positionText);
        // Draw the tile.
        tpDisplay.group.add(
            this.drawTile(tpDisplay.center, tChange, scaleTile, tChange.rotations)
        );
    }

    private drawEmptyTileAtPosition(tpDisplay: PositionData, scaleTile: number, positionText: string, colour: string): void {
        // Clear any existing tile position drawing.
        tpDisplay.group.clear();
        // Set the position description.
        tpDisplay.group.element('title').words(positionText);
        // Draw the empty tile position.
        this.drawTriangle(tpDisplay, scaleTile, colour);
    }

    drawTilePosition(tpDisplay: PositionData, tChange: TileChange, scaleTile: number): void {
        this.drawTileAtPosition(tpDisplay,
            "Position: " + tChange.tilePositionId + ", Tile: " + tChange.tileId, tChange, scaleTile);
    }

    drawStartPosition(tspDisplay: PositionData, tChange: TileChange, scaleTileStart: number): void {
        this.drawTileAtPosition(tspDisplay,
            "Start Position for Tile: " + tChange.tileId + " - Unused", tChange, scaleTileStart);
    }

    drawEmptyTilePosition(tpDisplay: PositionData, tpChange: TilePositionChange, scaleTile: number): void {
        this.drawEmptyTileAtPosition(tpDisplay, scaleTile,
            "Position: " + tpChange.tilePositionId + ", Tile: Empty",
            Display.TILE_POSITION_COLOUR);

    }

    drawEmptyStartPosition(tpDisplay: PositionData, tpChange: TileChange, scaleTile: number): void {
        this.drawEmptyTileAtPosition(tpDisplay, scaleTile,
            "Start Position for Tile: " + tpChange.tileId + " - At: " + tpChange.tilePositionId,
            Display.START_POSITION_COLOUR);

    }

    private getPosition(id: string): PositionData {
        const element = this._draw.findOne("[id='" + id + "']");
        const group = SVG(element) as G;
        const center = group.dom.center;
        return {group, center};
    }

    findTilePositions(): G[] {
        return this._draw.find("g")
            .filter((group) => !!group.id().match(/^[1-4]-[1-9]$/))
            .map((element) => SVG(element) as G);
    }

    getTilePosition(tpChange: TilePositionChange): PositionData {
        return this.getPosition(tpChange.tilePositionId);
    }

    getStartPosition(tChange: TileChange): PositionData {
        return this.getPosition("start" + tChange.tileId);
    }

    private createTileStartPosition(tspData: TileStartDisplayData, scaleTileStart: number): void {
        // Scale the tile start center point.
        const tspCenter = {
            x: tspData.center.x * scaleTileStart,
            y: tspData.center.y * scaleTileStart,
            r: tspData.center.r
        }
        this._draw.group().id("start" + tspData.id).setData({center: tspCenter});
    }

    private createTilePositions(fData: FaceDisplayData, fDisplay: PositionData, scaleFace: number): void {
        fData.tilePositions.forEach((tpData) => {
            // Scale the tile position center point.
            const tpCenter = {
                x: fDisplay.center.x + (tpData.center.x * scaleFace),
                y: fDisplay.center.y + (tpData.center.y * scaleFace),
                r: fDisplay.center.r + tpData.center.r
            };
            fDisplay.group.add(
                this._draw.group().id(fData.name + '-' + tpData.id).setData({center: tpCenter})
            );
        });
    }

    private createFace(fData: FaceDisplayData, scaleFace: number): void {
        // Create the display position for a face, including the draw group and center point.
        const fDisplay = {
            group: this._draw.group().id("face" + fData.name),
            center: {
                x: fData.center.x * scaleFace,
                y: fData.center.y * scaleFace,
                r: fData.center.r
            }
        }
        fDisplay.group.element('title').words("Face " + fData.name);
        // Fill in the face colour.
        this.drawTriangle(fDisplay, scaleFace, Display.FACE_COLOUR, 0);
        // Add a group for each tile position on the face.
        this.createTilePositions(fData, fDisplay, scaleFace);
        // Outline the face.
        this.drawTriangle(fDisplay, scaleFace, 'none', 0.01);
        // Draw a point to show the center of the face last so it always shows up.
        this._draw.circle(1)
            .id("center" + fData.name)
            .center(fDisplay.center.x, fDisplay.center.y)
            .fill(Display.LINE_COLOUR)
            .stroke('none')
            .element('title')
            .words("Center of Face " + fData.name);
    }

    createInitialDisplay(scaleFace: number, scaleTileStart: number): void {
        // Clear any existing display.
        this._draw.clear();
        // Display each face of the puzzle.
        this._displayData.faces.forEach((fData) => this.createFace(fData, scaleFace));
        // Start area group must be created last.
        this._displayData.tileStartPositions.forEach((tspData) =>
            this.createTileStartPosition(tspData, scaleTileStart));
    }

}
