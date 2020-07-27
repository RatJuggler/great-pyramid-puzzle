import { Tile } from "./tile";
import { IntegrityCheckResult } from "./common-data-schema";
import { Side, SIDES } from "./side";


type TilePositionJoinProperties = {
    readonly fromSide: Side,
    readonly toSide: Side;
    readonly ofTilePosition: TilePosition;
}


export class TilePosition {

    private _joins = new Array<TilePositionJoinProperties>();
    private _tile: Tile | null = null;

    constructor(private _name: string, private _onFace: string) {}

    integrityCheck(): IntegrityCheckResult {
        // Each tile position must join to 3 other tile positions.
        if (this._joins.length === SIDES.numberOfSides) {
            return [true, "Passed"];
        }
        return [false, `Tile position joins not complete: ${this.toString()}`];
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

    set tile(tile: Tile) {
        if (!this.isEmpty()) {
            throw new Error("Can't place a Tile when the TilePosition is already filled!");
        }
        this._tile = tile.placed();
    }

    join(fromSide: string, toSide: string, ofTilePosition: TilePosition) : void {
        if (this._joins.length === SIDES.numberOfSides) {
            throw new Error("TilePositions can only join to three other TilePositions!");
        }
        if (this === ofTilePosition) {
            throw new Error("Cannot join a TilePosition to itself!");
        }
        const nFromSide = SIDES.validateSide(fromSide, "to join from");
        const nToSide = SIDES.validateSide(toSide, "to join to");
        for (const join of this._joins) {
            if (join.fromSide === fromSide) {
                throw new Error(`Existing join already present for side ${fromSide}!`);
            }
        }
        this._joins.push({
            fromSide: nFromSide,
            toSide: nToSide,
            ofTilePosition: ofTilePosition
        });
    }

    isEmpty(): boolean {
        return !this._tile;
    }

    removeTile(): Tile {
        if (this.isEmpty()) {
            throw new Error("No Tile to remove!");
        }
        let tileToRemove = this._tile!;
        this._tile = null;
        return tileToRemove;
    }

    tilesMatch(): boolean {
        if (this.isEmpty()) {
            throw new Error("Can't check if a Tile matches when there is no Tile at the TilePosition to match from!");
        }
        // Check match for each join to another TilePosition.
        for (const join of this._joins) {
            // If the other TilePosition is empty then that will count as a match.
            const otherTilePosition = join.ofTilePosition;
            if (!otherTilePosition.isEmpty()) {
                // At this TilePosition we need the side of the Tile facing the other TilePosition.
                const thisSegments = this.tile.getSegmentsForSide(join.fromSide);
                // For the other TilePosition we then need the side of the Tile there, facing this TilePosition.
                const otherSegments = otherTilePosition.tile.getSegmentsForSideToMatchWith(join.toSide);
                // Finally we can make the comparison. Any failure means the current Tile doesn't match at this TilePosition.
                if (thisSegments !== otherSegments) {
                    return false;
                }
            }
        }
        return true;
    }

    segmentsToFind(): string {
        if (!this.isEmpty()) {
            throw new Error("TilePosition to find segments for already contains a Tile!");
        }
        let needToMatch: string = "";
        // Check each join to another TilePosition.
        for (const join of this._joins) {
            const otherTilePosition = join.ofTilePosition;
            if (otherTilePosition.isEmpty()) {
                // If no Tile search can be for anything.
                needToMatch += "....";
            } else {
                // If a Tile is present then we need the side of the Tile facing this TilePosition.
                needToMatch += otherTilePosition.tile.getSegmentsForSideToMatchWith(join.toSide);
            }
        }
        return needToMatch;
    }

    toString(): string {
        const tileString = this._tile ? this._tile.toString() : "Empty"
        let tilePositionString = `TilePosition: ${this._name}, On Face: ${this._onFace}, ` + `Contains Tile: [${tileString}], Joins: `;
        this._joins.forEach((join) =>
            tilePositionString += `(${this._name}-${join.fromSide}->${join.ofTilePosition._onFace}-${join.ofTilePosition.name}-${join.toSide})`);
        return tilePositionString;
    }

}
