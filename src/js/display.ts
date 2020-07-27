import { TileChange } from "./puzzle-changes";
import { DisplayData, FaceDisplayData, TileStartDisplayData, CenterPointData } from "./display-data-schema";
import { SVG, Svg, G } from "@svgdotjs/svg.js";


export class Display {

    private static readonly LINE_COLOUR = '#000000';
    private static readonly FACE_COLOUR = '#808080';
    private static readonly TILE_POSITION_COLOUR = '#C0C0C0';
    private static readonly START_POSITION_COLOUR = '#DCDCDC';
    private static readonly TILE_COLOUR = '#FFFFFF';
    private static readonly SEGMENT_COLOUR = '#FF0000';
    private static readonly PEG_COLOUR = '#BEBEBE';

    private readonly _draw: Svg;
    private readonly _scaleFace = this._displayData.faceScale;
    private readonly _scaleTile = this._displayData.tileScale * this._displayData.faceScale;
    private readonly _scaleTileStart = this._displayData.tileStartScale * this._displayData.faceScale;

    constructor(rootElement: string | HTMLElement, private readonly _displayData: DisplayData) {
        // Should be using an existing SVG root element.
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
            .stroke({ width: outline, color: Display.LINE_COLOUR});
    }

    drawTile(tpCenter: CenterPointData, tileId: number, rotations: number, segments: string): G {
        // Group the elements which make up a tile position.
        const tGroup = this._draw.group().id("tile" + tileId);
        // Fill in the tile colour.
        this.drawTriangle(tGroup, tpCenter, this._scaleTile, Display.TILE_COLOUR, 0);
        // Draw the red segments.
        for (let segN = 0; segN < segments.length; segN++) {
            if (segments.charAt(segN) === '1') {
                tGroup.polygon(this.scaleSegment(segN, tpCenter, this._scaleTile))
                    .rotate(tpCenter.r + (rotations * 120), tpCenter.x, tpCenter.y)
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
            this.drawTile(tpCenter, tChange.tileId, tChange.rotations, tChange.segments)
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
        const center = group.dom.center;
            return {group, center};
    }

    private createTilePositions(fData: FaceDisplayData, fCenter: CenterPointData, fGroup: G): void {
        fData.tilePositions.forEach((tpData) => {
            // Scale the tile position center point.
            const tpCenter = {
                x: fCenter.x + (tpData.center.x * this._scaleFace),
                y: fCenter.y + (tpData.center.y * this._scaleFace),
                r: fCenter.r + tpData.center.r
            };
            fGroup.add(
                this._draw.group().id(fData.name + '-' + tpData.id).setData({center: tpCenter})
            );
        });
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
        // Add a group for each tile position on the face.
        this.createTilePositions(fData, fCenter, fGroup);
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

    private createTileStartPosition(tspData: TileStartDisplayData): void {
        // Scale the tile start center point.
        const tspCenter = {
            x: tspData.center.x * this._scaleTileStart,
            y: tspData.center.y * this._scaleTileStart,
            r: tspData.center.r
        }
        const startGroup = this._draw.group().id(tspData.id).setData({center: tspCenter});
        startGroup.element('title').words(`Tile: ${tspData.id}`);
        this.drawTriangle(startGroup, tspCenter, this._scaleTileStart, Display.START_POSITION_COLOUR);
    }

    createInitialDisplay(): Svg {
        // Clear any existing display.
        this._draw.clear();
        // Display each face of the puzzle.
        this._displayData.faces.forEach((fData) => this.createFace(fData));
        // Start area group must be created last.
        this._displayData.tileStartPositions.forEach((tspData) => this.createTileStartPosition(tspData));
        // Return the main element.
        return this._draw;
    }

}
