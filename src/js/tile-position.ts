import { Tile } from "./tile";


interface TilePositionJoinProperties {
    readonly toSide: string;
    readonly ofTilePosition: TilePosition;
}


export class TilePosition {

    private static readonly SIDE_NAMES = ["A", "B", "C"];

    private _joins = new Map<string, TilePositionJoinProperties>();
    private _tile: Tile | null = null;

    constructor(private _name: string, private _onFace: string) {}

    integrityCheck(): [boolean, string] {
        // Each tile position must join to 3 other tile positions.
        if (this._joins.size === TilePosition.SIDE_NAMES.length) {
            return [true, "Passed"];
        }
        return [false, `Tile position joins not complete: ${this.toString()}`];
    }

    toString(): string {
        let tileString = `TilePosition: ${this._name}, On Face: ${this._onFace}, Contains Tile: [${this._tile}], Joins: `;
        this._joins.forEach((join, side) =>
            tileString += `(${this._name}-${side}->${join.ofTilePosition._onFace}-${join.ofTilePosition.name}-${join.toSide})`);
        return tileString;
    }

    get id(): string {
        return this._onFace + "-" + this._name;
    }

    get name(): string {
        return this._name;
    }

    get tile(): Tile {
        if (this._tile === null) {
            throw new Error("Can't fetch a Tile when there isn't one!");
        }
        return this._tile;
    }

    join(fromSide: string, toSide: string, ofTilePosition: TilePosition) : void {
        if (this._joins.size === TilePosition.SIDE_NAMES.length) {
            throw new Error("Tile positions can only join to three other tile positions!");
        }
        if (this === ofTilePosition) {
            throw new Error("Cannot join a TilePosition to itself!");
        }
        if (!(TilePosition.SIDE_NAMES.includes(fromSide))) {
            throw new Error(`Side to join from must be one of ${TilePosition.SIDE_NAMES}!`);
        }
        if (!(TilePosition.SIDE_NAMES.includes(toSide))) {
            throw new Error(`Side to join to must be one of ${TilePosition.SIDE_NAMES}!`);
        }
        if (this._joins.get(fromSide)) {
            throw new Error(`Existing join already present for side ${fromSide}!`);
        }
        this._joins.set(fromSide, {
            toSide: toSide,
            ofTilePosition: ofTilePosition
        });
    }

    isEmpty(): boolean {
        return !this._tile;
    }

    placeTile(tile: Tile): TilePosition {
        if (!this.isEmpty()) {
            throw new Error("Can't place a Tile when the position is already filled!");
        }
        this._tile = tile.place();
        return this;
    }

    removeTile(): boolean {
        if (this.isEmpty()) {
            return false;
        }
        this._tile = null;
        return true;
    }

    matches(): boolean {
        if (this.isEmpty()) {
            throw new Error("Can't check if a Position matches when there is no Tile to match from!");
        }
        return true;
    }

}
