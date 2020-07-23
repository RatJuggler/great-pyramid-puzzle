// Display Events/Changes:
// Initial - Draw an empty puzzle
// Empty - Draw an empty tile position
// Final - Draw a tile at it's final tile position (no animation)
// Place - Animate placing a tile at a tile position
// Rotate - Animate rotating a tile at a tile position
// Remove - Animate removing the tile at a tile position

import { TileChange, TilePositionChange } from "./tile-position-change";
import { Matrix, Svg } from "@svgdotjs/svg.js";
import { DisplayData } from "./display-data-schema";
import { Display } from "./display";


abstract class DisplayChange {

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
                private readonly _tChange: TileChange,
                private readonly _animationDuration: number) {
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
        placeTile.animate({duration: this._animationDuration}).transform(matrix)
            .after(() => {
                // Remove the animated tile then redraw the tile position with the placed tile.
                placeTile.remove();
                this.display.drawTilePosition(tpDisplay.group, tpDisplay.center, this._tChange);
            });
    }

}


class RotateTilePosition extends DisplayChange {

    constructor(display: Display,
                private readonly _tpChange: TilePositionChange,
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
            .rotate(120, tpDisplay.center.x, tpDisplay.center.y);
    }

}


class RemoveTilePosition extends DisplayChange {

    constructor(display: Display,
                private readonly _tChange: TileChange,
                private readonly _animationDuration: number) {
        super(display);
    }

    show(): void {
        // Find the tile position of the tile to be removed.
        const tpDisplay = this.display.getTilePosition(this._tChange.tilePositionId);
        // Redraw the tile position with the tile removed then draw the tile at the tile position ready to be animated.
        this.display.drawEmptyTilePosition(tpDisplay.group, tpDisplay.center, this._tChange.tilePositionId);
        const removeTile = this.display.drawTile(tpDisplay.center, this._tChange.tileId, this._tChange.rotatedSegments);
        // Animate the tile moving from it's old position back to the start.
        const matrix = new Matrix()
            .translate(- (tpDisplay.center.x - this.display.startCenter.x), - (tpDisplay.center.y - this.display.startCenter.y))
            .rotate(-tpDisplay.center.r, this.display.startCenter.x, this.display.startCenter.y);
        // @ts-ignore
        removeTile.animate({duration: this._animationDuration}).transform(matrix)
            .after(() => {
                // Remove the animated tile.
                removeTile.remove();
            });
    }

}


export class DisplayManager {

    private static readonly DEFAULT_ANIMATION_DURATION = 250;

    private readonly _display: Display;

    constructor(rootElement: string | HTMLElement,
                displayData: DisplayData,
                private _animationDuration: number = DisplayManager.DEFAULT_ANIMATION_DURATION) {
        this._display = new Display(rootElement, displayData)
    }

    set animationDuration(duration: number) {
        this._animationDuration = duration;
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
                action = new PlaceTilePosition(this._display, tpChange as TileChange, this._animationDuration);
                break;
            case "Rotate":
                action = new RotateTilePosition(this._display, tpChange, this._animationDuration);
                break;
            case "Remove":
                action = new RemoveTilePosition(this._display, tpChange as TileChange, this._animationDuration);
                break;
            default:
                throw new Error("Unknown tile position change!");
        }
        action.show();
    }

}
