// Display Events/Changes:
// Initial - Draw an empty puzzle
// Empty - Draw an empty tile position
// Final - Draw a tile at it's final tile position (no animation)
// Place - Animate placing a tile at a tile position
// Rotate - Animate rotating a tile at a tile position
// Remove - Animate removing the tile at a tile position


import { DisplayManager } from "./display";
import { TileChange, TilePositionChange } from "./tile-position-change";
import { G, Matrix, SVG } from "@svgdotjs/svg.js";


abstract class DisplayChange {

    protected static readonly ANIMATE_DURATION = 500;

    protected constructor(protected displayManager: DisplayManager) {}

    abstract show(): void;

}


class EmptyTilePosition extends DisplayChange {

    constructor(displayManager: DisplayManager,
                private readonly _tpChange: TilePositionChange) {
        super(displayManager);
    }

    show(): void {
        // Find the tile position to be displayed empty.
        const tpDisplay = this.displayManager.getTilePosition(this._tpChange.tilePositionId);
        // Redraw the empty tile position.
        this.displayManager.drawEmptyTilePosition(tpDisplay.group, tpDisplay.center, this._tpChange.tilePositionId);
    }

}


class FinalTilePosition extends DisplayChange {

    constructor(displayManager: DisplayManager,
                private readonly _tChange: TileChange) {
        super(displayManager);
    }

    show(): void {
        // Find the destination tile position of the new tile.
        const tpDisplay = this.displayManager.getTilePosition(this._tChange.tilePositionId);
        // Redraw the tile position with the placed tile.
        this.displayManager.drawTilePosition(tpDisplay.group, tpDisplay.center, this._tChange);
    }

}


class PlaceTilePosition extends DisplayChange {

    constructor(displayManager: DisplayManager,
                private readonly _tChange: TileChange) {
        super(displayManager);
    }

    show(): void {
        // Find the destination tile position of the new tile.
        const tpDisplay = this.displayManager.getTilePosition(this._tChange.tilePositionId);
        // Draw the tile to be placed at the starting position.
        const placeTile = this.displayManager.drawTile(this.displayManager.startCenter, this._tChange.tileId, this._tChange.rotatedSegments);
        // Animate the tile moving from the start to the destination.
        const matrix = new Matrix()
            .translate(tpDisplay.center.x - this.displayManager.startCenter.x, tpDisplay.center.y - this.displayManager.startCenter.y)
            .rotate(tpDisplay.center.r, tpDisplay.center.x, tpDisplay.center.y);
        // @ts-ignore
        placeTile.animate({duration: this.ANIMATE_DURATION}).transform(matrix)
            .after(() => {
                // Remove the animated tile then redraw the tile position with the placed tile.
                placeTile.remove();
                this.displayManager.drawTilePosition(tpDisplay.group, tpDisplay.center, this._tChange);
            });
    }

}


class RotateTilePosition extends DisplayChange {

    constructor(displayManager: DisplayManager,
                private readonly _tpChange: TilePositionChange) {
        super(displayManager);
    }

    show(): void {
        // Find the tile position of the tile to be rotated.
        const tpDisplay = this.displayManager.getTilePosition(this._tpChange.tilePositionId);
        // Rotate the child tile group.
        const tGroup = SVG(tpDisplay.group.children()[1]) as G;
        // @ts-ignore
        tGroup.animate({duration: this.ANIMATE_DURATION, ease: "<>"}).rotate(120, tpDisplay.center.x, tpDisplay.center.y);
    }

}


class RemoveTilePosition extends DisplayChange {

    constructor(displayManager: DisplayManager,
                private readonly _tChange: TileChange) {
        super(displayManager);
    }

    show(): void {
        // Find the tile position of the tile to be removed.
        const tpDisplay = this.displayManager.getTilePosition(this._tChange.tilePositionId);
        // Redraw the tile position with the tile removed then draw the tile at the tile position ready to be animated.
        this.displayManager.drawEmptyTilePosition(tpDisplay.group, tpDisplay.center, this._tChange.tilePositionId);
        const removeTile = this.displayManager.drawTile(this.displayManager.startCenter, this._tChange.tileId, this._tChange.rotatedSegments);
        // Animate the tile moving from it's old position back to the start.
        const matrix = new Matrix()
            .translate(this.displayManager.startCenter.x - tpDisplay.center.x, this.displayManager.startCenter.y - tpDisplay.center.y)
            .rotate(-tpDisplay.center.r, this.displayManager.startCenter.x, this.displayManager.startCenter.y);
        // @ts-ignore
        removeTile.animate({duration: this.ANIMATE_DURATION}).transform(matrix)
            .after(() => {
                // Remove the animated tile.
                removeTile.remove();
            });
    }

}


function display(displayManager: DisplayManager, tpChange: TilePositionChange) {
    let action;
    switch (tpChange.type) {
        case "Empty":
            action = new EmptyTilePosition(displayManager, tpChange);
            break;
        case "Final":
            action = new FinalTilePosition(displayManager, tpChange as TileChange);
            break;
        case "Place":
            action = new PlaceTilePosition(displayManager, tpChange as TileChange);
            break;
        case "Rotate":
            action = new RotateTilePosition(displayManager, tpChange);
            break;
        case "Remove":
            action = new RemoveTilePosition(displayManager, tpChange as TileChange);
            break;
        default:
            throw new Error("Unknown tile position change!");
    }
    action.show();
}


export { display }
