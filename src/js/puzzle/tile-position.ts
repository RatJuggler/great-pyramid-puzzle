import { IntegrityCheck, IntegrityCheckResult } from "./integrity";
import { TilePositionState } from "./tile-position-state";
import { Side, SIDES } from "./side";


type TilePositionJoinProperties = {
    readonly fromSide: Side,
    readonly toSide: Side,
    readonly ofTilePosition: TilePosition
}


export class TilePosition implements IntegrityCheck {

    private _joins = new Array<TilePositionJoinProperties>();
    private _state: TilePositionState = new TilePositionState();

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

    get state(): TilePositionState {
        return this._state;
    }

    join(joinFrom: string, joinTo: string, ofTilePosition: TilePosition) : void {
        if (this._joins.length === SIDES.numberOfSides) {
            throw new Error("TilePositions can only join to three other TilePositions!");
        }
        if (this === ofTilePosition) {
            throw new Error("Cannot join a TilePosition to itself!");
        }
        const fromSide = SIDES.validateSide(joinFrom, "to join from");
        const toSide = SIDES.validateSide(joinTo, "to join to");
        for (const join of this._joins) {
            if (join.fromSide === joinFrom) {
                throw new Error(`Existing join already present for side ${joinFrom}!`);
            }
        }
        this._joins.push({
            fromSide: fromSide,
            toSide: toSide,
            ofTilePosition: ofTilePosition
        });
    }

    private sideMatches(join: TilePositionJoinProperties): boolean {
        // If the other TilePosition is empty then that will count as a match.
        const otherState = join.ofTilePosition.state;
        if (!otherState.isEmpty()) {
            // At this TilePosition we need the side of the Tile facing the other TilePosition.
            const thisSegments = this.state.tile.getSegmentsForSide(this.state.rotations, join.fromSide);
            // For the other TilePosition we then need the side of the Tile there, facing this TilePosition.
            const otherSegments = otherState.tile.getSegmentsForSideToMatchWith(otherState.rotations, join.toSide);
            // Finally we can make the comparison. Any failure means the current Tile doesn't match at this TilePosition.
            if (thisSegments !== otherSegments) {
                return false;
            }
        }
        return true;
    }

    sidesMatching(): number {
        if (this.state.isEmpty()) {
            throw new Error("Can't check if a Tiles sides match when there is no Tile at the TilePosition to match from!");
        }
        // Count the matching sides for each join to another TilePosition.
        return this._joins.reduce((matches, join) => matches + (this.sideMatches(join) ? 1 : 0), 0);
    }

    tilesMatch(): boolean {
        // Check that all the sides match.
        return this.sidesMatching() == this._joins.length;
    }

    private static sideSegments(join: TilePositionJoinProperties): string {
        const otherState = join.ofTilePosition.state;
        if (otherState.isEmpty()) {
            // If no Tile search can be for anything.
            return "....";
        } else {
            // If a Tile is present then we need the side of the Tile facing this TilePosition.
            return otherState.tile.getSegmentsForSideToMatchWith(otherState.rotations, join.toSide);
        }
    }

    segmentsToFind(): string {
        if (!this.state.isEmpty()) {
            throw new Error("TilePosition to find segments for already contains a Tile!");
        }
        let needToMatch: string = "";
        // Check each join to another TilePosition.
        for (const join of this._joins) {
            needToMatch += TilePosition.sideSegments(join);
        }
        return needToMatch;
    }

    toString(): string {
        let tilePositionString = `TilePosition: ${this._name}, On Face: ${this._onFace}, Contains Tile: ${this.state.toString()}, Joins: `;
        this._joins.forEach((join) =>
            tilePositionString += `(${this._name}-${join.fromSide}->${join.ofTilePosition._onFace}-${join.ofTilePosition.name}-${join.toSide})`);
        return tilePositionString;
    }

}
