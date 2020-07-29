import { PuzzleChange, PuzzleChangeType, TileChange, TilePositionChange } from "./puzzle-changes";
import { Matrix } from "@svgdotjs/svg.js";
import { DisplayData } from "./display-data-schema";
import { Display } from "./display";


abstract class DisplayChange {

    protected constructor(protected readonly display: Display) {}

    abstract show(): void;

}


class InitialDisplay extends DisplayChange {

    constructor(display: Display,
                private readonly _scaleFace: number,
                private readonly _scaleTileStart: number) {
        super(display);
    }

    show(): void {
        this.display.createInitialDisplay(this._scaleFace, this._scaleTileStart);
    }

}


class EmptyTilePosition extends DisplayChange {

    constructor(display: Display,
                private readonly _tpChange: TilePositionChange,
                private readonly _scaleTile: number) {
        super(display);
    }

    show(): void {
        // Find the tile position to be displayed empty.
        const tpDisplay = this.display.getTilePosition(this._tpChange);
        // Redraw the empty tile position.
        this.display.drawEmptyTilePosition(tpDisplay, this._tpChange, this._scaleTile);
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
        const spDisplay = this.display.getStartPosition(this._tChange);
        // Draw the tile at it's start position.
        this.display.drawStartPosition(spDisplay, this._tChange, this._scaleTileStart);
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
        const tpDisplay = this.display.getTilePosition(this._tChange);
        // Redraw the tile position with the placed tile.
        this.display.drawTilePosition(tpDisplay, this._tChange, this._scaleTile);
    }

}


class PlaceTilePosition extends DisplayChange {

    constructor(display: Display,
                private readonly _tChange: TileChange,
                private readonly _scaleTileStart: number,
                private readonly _scaleTile: number,
                private readonly _animationDuration: number) {
        super(display);
    }

    show(): void {
        // Find the start position of the tile to place on the puzzle.
        const tspDisplay = this.display.getStartPosition(this._tChange);
        // Find the destination tile position of the new tile.
        const tpDisplay = this.display.getTilePosition(this._tChange);
        // Redraw the start position with the tile removed then draw the tile at the start position ready to be animated.
        this.display.drawEmptyStartPosition(tspDisplay, this._tChange, this._scaleTileStart);
        const placeTile = this.display.drawTile(tspDisplay.center, this._tChange, this._scaleTileStart, 0);
        // Animate the tile moving from the start position to the destination position.
        const scaleChange = this._scaleTile / this._scaleTileStart;
        const matrix = new Matrix()
            .translate(tpDisplay.center.x - tspDisplay.center.x, tpDisplay.center.y - tspDisplay.center.y)
            .rotate(tpDisplay.center.r + (this._tChange.rotations * 120), tpDisplay.center.x, tpDisplay.center.y)
            .scale(scaleChange, scaleChange, tpDisplay.center.x, tpDisplay.center.y);
        // @ts-ignore
        placeTile.animate({duration: this._animationDuration}).transform(matrix)
            .after(() => {
                // Remove the animated tile then redraw the tile position with the placed tile.
                placeTile.remove();
                this.display.drawTilePosition(tpDisplay, this._tChange, this._scaleTile,);
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
        const tpDisplay = this.display.getTilePosition(this._tpChange);
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
        // Find the start position of the tile being removed.
        const tspDisplay = this.display.getStartPosition(this._tChange);
        // Find the tile position of the tile to be removed.
        const tpDisplay = this.display.getTilePosition(this._tChange);
        // Redraw the tile position with the tile removed then draw the tile at the tile position ready to be animated.
        this.display.drawEmptyTilePosition(tpDisplay, this._tChange, this._scaleTile);
        const removeTile = this.display.drawTile(tpDisplay.center, this._tChange, this._scaleTile, this._tChange.rotations);
        // Animate the tile moving from it's old position back to the start.
        const scaleChange = this._scaleTileStart / this._scaleTile;
        const matrix = new Matrix()
            .translate(- (tpDisplay.center.x - tspDisplay.center.x), - (tpDisplay.center.y - tspDisplay.center.y))
            .rotate(-tpDisplay.center.r, tspDisplay.center.x, tspDisplay.center.y)
            .scale(scaleChange, scaleChange, tspDisplay.center.x, tspDisplay.center.y);
        // @ts-ignore
        removeTile.animate({duration: this._animationDuration}).transform(matrix)
            .after(() => {
                // Remove the animated tile then redraw the tile at its start position.
                removeTile.remove();
                this.display.drawStartPosition(tspDisplay, this._tChange, this._scaleTileStart);
            });
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

    display(pChange: PuzzleChange) {
        let action;
        switch (pChange.type) {
            case PuzzleChangeType.Initial:
                action = new InitialDisplay(this._display, this._scaleFace, this._scaleTileStart);
                break;
            case PuzzleChangeType.Empty:
                action = new EmptyTilePosition(this._display, pChange as TilePositionChange, this._scaleTile);
                break;
            case PuzzleChangeType.Start:
                action = new StartTilePosition(this._display, pChange as TileChange, this._scaleTileStart);
                break;
            case PuzzleChangeType.Final:
                action = new FinalTilePosition(this._display, pChange as TileChange, this._scaleTile);
                break;
            case PuzzleChangeType.Place:
                action = new PlaceTilePosition(this._display, pChange as TileChange,  this._scaleTileStart, this._scaleTile, this._animationDuration);
                break;
            case PuzzleChangeType.Rotate:
                action = new RotateTilePosition(this._display, pChange as TileChange, this._animationDuration);
                break;
            case PuzzleChangeType.Remove:
                action = new RemoveTilePosition(this._display, pChange as TileChange, this._scaleTileStart, this._scaleTile, this._animationDuration);
                break;
            default:
                throw new Error("Unknown puzzle display change!");
        }
        action.show();
    }

}
