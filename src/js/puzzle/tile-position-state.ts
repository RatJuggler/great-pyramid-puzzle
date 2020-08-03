import { Tile } from "./tile";


export class TilePositionState {

    private _tile: Tile | null = null;
    private _rotations: number = 0;

    constructor() {}

    get tile(): Tile {
        if (this._tile === null) {
            throw new Error("Can't fetch a Tile from a TilePositionState when there isn't one set!");
        }
        return this._tile;
    }

    set tile(tile: Tile) {
        if (!this.isEmpty()) {
            throw new Error("Can't set a Tile when the TilePositionState already has one!");
        }
        this._rotations = 0;
        this._tile = tile;
    }

    get rotations(): number {
        return this._rotations;
    }

    set rotations(rotations: number) {
        if (this.isEmpty()) {
            throw new Error("No point setting rotations when the TilePositionState doesn't have a Tile!");
        }
        if (rotations !== 0 && rotations !== 1 && rotations !== 2) {
            throw new Error("Tile can only be rotated 0, 1 or 2 times!");
        }
        this._rotations = rotations
    }

    isEmpty(): boolean {
        return !this._tile;
    }

    removeTile(): Tile {
        if (this.isEmpty()) {
            throw new Error("No Tile to remove from the TilePositionState!");
        }
        let tileToRemove = this._tile!;
        this._tile = null;
        return tileToRemove;
    }

    rotate(): boolean {
        if (this.isEmpty()) {
            throw new Error("No point calling rotate when the TilePositionState doesn't have a Tile!");
        }
        this._rotations = ++this._rotations % 3;
        return this._rotations !== 0;
    }

    toString(): string {
        if (this.isEmpty()) {
            return "[Empty]";
        } else {
            return `[Rotations: ${this.rotations}, Tile: ${this.tile}]`;
        }
    }

}
