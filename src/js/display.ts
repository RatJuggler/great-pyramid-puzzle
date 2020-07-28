import { TileChange } from "./puzzle-changes";
import { DisplayData, FaceDisplayData, TileStartDisplayData, CenterPointData } from "./display-data-schema";
import { SVG, Svg, G } from "@svgdotjs/svg.js";


export class Display {

    private static readonly LINE_COLOUR = '#000000';
    private static readonly FACE_COLOUR = '#808080';
    private static readonly TILE_POSITION_COLOUR = '#C0C0C0';
    // private static readonly START_POSITION_COLOUR = '#DCDCDC';
    private static readonly TILE_COLOUR = '#FFFFFF';
    private static readonly SEGMENT_COLOUR = '#FF0000';
    private static readonly PEG_COLOUR = '#BEBEBE';

    private readonly _draw: Svg;

    constructor(rootElement: string | HTMLElement, private readonly _displayData: DisplayData) {
        // Should be using an existing SVG root element.
        this._draw = SVG(rootElement) as Svg;
    }

    private drawTriangle(draw: G, tpCenter: CenterPointData, scale: number, fill: string, outline: number = 0.01): void {
        draw.polygon(this._displayData.triangle)
            .dmove(tpCenter.x, tpCenter.y)
            .rotate(tpCenter.r, tpCenter.x, tpCenter.y)
            .fill(fill)
            .stroke({ width: outline, color: Display.LINE_COLOUR})
            .scale(scale, scale, tpCenter.x, tpCenter.y);
    }

    drawTile(tpCenter: CenterPointData, scaleTile: number, tileId: number, rotations: number, segments: string): G {
        // Group the elements which make up a tile position.
        const tGroup = this._draw.group().id("tile" + tileId);
        // Fill in the tile colour.
        this.drawTriangle(tGroup, tpCenter, scaleTile, Display.TILE_COLOUR, 0);
        // Draw the red segments.
        for (let segN = 0; segN < segments.length; segN++) {
            if (segments.charAt(segN) === '1') {
                tGroup.polygon(this._displayData.segments[segN])
                    .dmove(tpCenter.x, tpCenter.y)
                    .rotate(tpCenter.r + (rotations * 120), tpCenter.x, tpCenter.y)
                    .fill(Display.SEGMENT_COLOUR)
                    .stroke('none')
                    .scale(scaleTile, scaleTile, tpCenter.x, tpCenter.y);
            }
        }
        // Outline the tile.
        this.drawTriangle(tGroup, tpCenter, scaleTile, 'none');
        // Draw the peg in the middle.
        tGroup.circle(this._displayData.pegScale)
            .center(tpCenter.x, tpCenter.y)
            .fill(Display.PEG_COLOUR)
            .stroke('none')
            .scale(scaleTile, scaleTile, tpCenter.x, tpCenter.y);
        return tGroup;
    }

    drawTilePosition(tpGroup: G, tpCenter: CenterPointData, tChange: TileChange, scaleTile: number): void {
        // Clear any existing tile position drawing.
        tpGroup.clear();
        // Set the tile description.
        const desc = "Position: " + tChange.tilePositionId + ", Tile: " + tChange.tileId;
        tpGroup.element('title').words(desc);
        // Draw the tile.
        tpGroup.add(
            this.drawTile(tpCenter, scaleTile, tChange.tileId, tChange.rotations, tChange.segments)
        );
    }

    drawEmptyTilePosition(tpGroup: G, tpCenter: CenterPointData, positionText: string, scaleTile: number): void {
        // Clear any existing tile position drawing.
        tpGroup.clear();
        // Set the tile description.
        const desc = "Position: " + positionText + ", Tile: Empty";
        tpGroup.element('title').words(desc);
        // Draw the empty tile position.
        this.drawTriangle(tpGroup, tpCenter, scaleTile, Display.TILE_POSITION_COLOUR);
    }

    getTilePosition(id: string): { group: G; center: CenterPointData; } {
        const element = this._draw.findOne("[id='" + id + "']");
        const group = SVG(element) as G;
        const center = group.dom.center;
        return {group, center};
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

    private createTilePositions(fData: FaceDisplayData, fCenter: CenterPointData, fGroup: G, scaleFace: number): void {
        fData.tilePositions.forEach((tpData) => {
            // Scale the tile position center point.
            const tpCenter = {
                x: fCenter.x + (tpData.center.x * scaleFace),
                y: fCenter.y + (tpData.center.y * scaleFace),
                r: fCenter.r + tpData.center.r
            };
            fGroup.add(
                this._draw.group().id(fData.name + '-' + tpData.id).setData({center: tpCenter})
            );
        });
    }

    private createFace(fData: FaceDisplayData, scaleFace: number): void {
        // Scale the face center point.
        const fCenter = {
            x: fData.center.x * scaleFace,
            y: fData.center.y * scaleFace,
            r: fData.center.r
        }
        // Create a group for the elements on a face.
        const fGroup = this._draw.group().id("face" + fData.name);
        fGroup.element('title').words("Face " + fData.name);
        // Fill in the face colour.
        this.drawTriangle(fGroup, fCenter, scaleFace, Display.FACE_COLOUR, 0);
        // Add a group for each tile position on the face.
        this.createTilePositions(fData, fCenter, fGroup, scaleFace);
        // Outline the face.
        this.drawTriangle(fGroup, fCenter, scaleFace, 'none', 0.02);
        // Draw a point to show the center of the face last so it always shows up.
        this._draw.circle(1)
            .id("center" + fData.name)
            .center(fCenter.x, fCenter.y)
            .fill(Display.LINE_COLOUR)
            .stroke('none')
            .element('title')
            .words("Center of Face " + fData.name);
    }

    createInitialDisplay(scaleFace: number, scaleTileStart: number): Svg {
        // Clear any existing display.
        this._draw.clear();
        // Display each face of the puzzle.
        this._displayData.faces.forEach((fData) => this.createFace(fData, scaleFace));
        // Start area group must be created last.
        this._displayData.tileStartPositions.forEach((tspData) => this.createTileStartPosition(tspData, scaleTileStart));
        // Return the main element.
        return this._draw;
    }

}
