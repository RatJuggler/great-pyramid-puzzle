import { PuzzleChange, PuzzleChangeType, TileChange, TilePositionChange } from "./puzzle-changes";
import { Matrix, Svg } from "@svgdotjs/svg.js";
import { DisplayData } from "./display-data-schema";
import { Display } from "./display";


abstract class DisplayChange {

    protected constructor(protected readonly display: Display) {}

    abstract show(): void;

}


class EmptyTilePosition extends DisplayChange {

    constructor(display: Display,
                private readonly _tpChange: TilePositionChange,
                private readonly _scaleTile: number) {
        super(display);
    }

    show(): void {
        // Find the tile position to be displayed empty.
        const tpDisplay = this.display.getTilePosition(this._tpChange.tilePositionId);
        // Redraw the empty tile position.
        this.display.drawEmptyTilePosition(tpDisplay.group, tpDisplay.center, this._tpChange.tilePositionId, this._scaleTile);
    }

}


class StartTilePosition extends DisplayChange {

    constructor(display: Display,
                private readonly _tChange: TileChange,
                private readonly _scaleTileStart: number) {
        super(display);
    }

    show(): void {
        // Find start position of the tile.
        const startPosition = this.display.getTilePosition(this._tChange.tileId.toString());
        // Draw the tile over it's start position.
        this.display.drawTile(startPosition.center, this._scaleTileStart, this._tChange.tileId, 0, this._tChange.segments);
    }

}


class FinalTilePosition extends DisplayChange {

    constructor(display: Display,
                private readonly _tChange: TileChange,
                private readonly _scaleTile: number) {
        super(display);
    }

    show(): void {
        // Find the destination tile position of the new tile.
        const tpDisplay = this.display.getTilePosition(this._tChange.tilePositionId);
        // Redraw the tile position with the placed tile.
        this.display.drawTilePosition(tpDisplay.group, tpDisplay.center, this._tChange, this._scaleTile);
    }

}


class PlaceTilePosition extends DisplayChange {

    constructor(display: Display,
                private readonly _tChange: TileChange,
                private readonly _scaleTile: number,
                private readonly _animationDuration: number) {
        super(display);
    }

    show(): void {
        // Find the start position of the new tile.
        const tspDisplay = this.display.getTilePosition(this._tChange.tileId.toString());
        // Find the destination tile position of the new tile.
        const tpDisplay = this.display.getTilePosition(this._tChange.tilePositionId);
        // Find the tile at it's starting positin.
        const placeTile = this.display.findTile(this._tChange.tileId);
        // Animate the tile moving from the start to the destination.
        const matrix = new Matrix()
            .translate(tpDisplay.center.x - tspDisplay.center.x, tpDisplay.center.y - tspDisplay.center.y)
            .rotate(tpDisplay.center.r + (this._tChange.rotations * 120), tpDisplay.center.x, tpDisplay.center.y);
        // @ts-ignore
        placeTile.animate({duration: this._animationDuration}).transform(matrix)
            .after(() => {
                // Remove the animated tile then redraw the tile position with the placed tile.
                placeTile.remove();
                this.display.drawTilePosition(tpDisplay.group, tpDisplay.center, this._tChange, this._scaleTile);
            });
    }

}


class RotateTilePosition extends DisplayChange {

    constructor(display: Display,
                private readonly _tpChange: TileChange,
                private readonly _animationDuration: number) {
        super(display);
    }

    show(): void {
        // Find the tile position of the tile to be rotated.
        const tpDisplay = this.display.getTilePosition(this._tpChange.tilePositionId);
        // Find the child tile.
        const tile = tpDisplay.group.children()[1];
        // Rotate the tile.
        tile.animate({duration: this._animationDuration, ease: "<>"})
            // @ts-ignore
            .rotate(this._tpChange.rotations * 120, tpDisplay.center.x, tpDisplay.center.y);
    }

}


class RemoveTilePosition extends DisplayChange {

    constructor(display: Display,
                private readonly _tChange: TileChange,
                private readonly _scaleTileStart: number,
                private readonly _scaleTile: number,
                private readonly _animationDuration: number) {
        super(display);
    }

    show(): void {
        // Find the start position of the new tile.
        const tspDisplay = this.display.getTilePosition(this._tChange.tileId.toString());
        // Find the tile position of the tile to be removed.
        const tpDisplay = this.display.getTilePosition(this._tChange.tilePositionId);
        // Redraw the tile position with the tile removed then draw the tile at the tile position ready to be animated.
        this.display.drawEmptyTilePosition(tpDisplay.group, tpDisplay.center, this._tChange.tilePositionId, this._scaleTile);
        const removeTile = this.display.drawTile(tpDisplay.center, this._scaleTileStart, this._tChange.tileId, this._tChange.rotations, this._tChange.segments);
        // Animate the tile moving from it's old position back to the start.
        const matrix = new Matrix()
            .translate(- (tpDisplay.center.x - tspDisplay.center.x), - (tpDisplay.center.y - tspDisplay.center.y))
            .rotate(-tpDisplay.center.r, tspDisplay.center.x, tspDisplay.center.y);
        // @ts-ignore
        removeTile.animate({duration: this._animationDuration}).transform(matrix);
    }

}


export class DisplayManager {

    private readonly _display: Display;
    private readonly _scaleFace: number;
    private readonly _scaleTile: number;
    private readonly _scaleTileStart: number;

    constructor(rootElement: string | HTMLElement,
                displayData: DisplayData,
                private _animationDuration: number) {
        this._display = new Display(rootElement, displayData)
        this._scaleFace = displayData.faceScale;
        this._scaleTile = displayData.tileScale * displayData.faceScale;
        this._scaleTileStart = displayData.tileStartScale * displayData.faceScale;
    }

    set animationDuration(duration: number) {
        this._animationDuration = duration;
    }

    initialDisplay(): Svg {
        return this._display.createInitialDisplay(this._scaleFace, this._scaleTileStart);
    }

    display(tpChange: PuzzleChange) {
        let action;
        switch (tpChange.type) {
            case PuzzleChangeType.Empty:
                action = new EmptyTilePosition(this._display, tpChange as TilePositionChange, this._scaleTile);
                break;
            case PuzzleChangeType.Start:
                action = new StartTilePosition(this._display, tpChange as TileChange, this._scaleTileStart);
                break;
            case PuzzleChangeType.Final:
                action = new FinalTilePosition(this._display, tpChange as TileChange, this._scaleTile);
                break;
            case PuzzleChangeType.Place:
                action = new PlaceTilePosition(this._display, tpChange as TileChange, this._scaleTile, this._animationDuration);
                break;
            case PuzzleChangeType.Rotate:
                action = new RotateTilePosition(this._display, tpChange as TileChange, this._animationDuration);
                break;
            case PuzzleChangeType.Remove:
                action = new RemoveTilePosition(this._display, tpChange as TileChange, this._scaleTileStart, this._scaleTile, this._animationDuration);
                break;
            default:
                throw new Error("Unknown tile position change!");
        }
        action.show();
    }

}
