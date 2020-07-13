import {Tile} from "./tile";
import {IntegrityCheckResult} from "./common-data-schema";
import {Side, SIDES} from "./side";


interface TilePositionJoinProperties {
    readonly toSide: Side;
    readonly ofTilePosition: TilePosition;
}


export class TilePosition {

    private static readonly TILE_ROTATION = [
        new Map<Side, Side>([[Side.SideA, Side.SideA], [Side.SideB, Side.SideB], [Side.SideC, Side.SideC]]),
        new Map<Side, Side>([[Side.SideA, Side.SideC], [Side.SideB, Side.SideA], [Side.SideC, Side.SideB]]),
        new Map<Side, Side>([[Side.SideA, Side.SideB], [Side.SideB, Side.SideC], [Side.SideC, Side.SideA]])
    ];

    private _joins = new Map<Side, TilePositionJoinProperties>();
    private _tile: Tile | null = null;
    private _tileRotation: number = 0;

    constructor(private _name: string, private _onFace: string) {}

    integrityCheck(): IntegrityCheckResult {
        // Each tile position must join to 3 other tile positions.
        if (this._joins.size === SIDES.numberOfSides) {
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

    toString(): string {
        let tileString = `TilePosition: ${this._name}, On Face: ${this._onFace}, ` +
            `Contains Tile: [${this._tile}], Rotated: ${this._tileRotation}, Joins: `;
        this._joins.forEach((join, side) =>
            tileString += `(${this._name}-${side}->${join.ofTilePosition._onFace}-${join.ofTilePosition.name}-${join.toSide})`);
        return tileString;
    }

    join(fromSide: string, toSide: string, ofTilePosition: TilePosition) : void {
        if (this._joins.size === SIDES.numberOfSides) {
            throw new Error("TilePositions can only join to three other TilePositions!");
        }
        if (this === ofTilePosition) {
            throw new Error("Cannot join a TilePosition to itself!");
        }
        const nFromSide = SIDES.validateSide(fromSide, "to join from");
        const nToSide = SIDES.validateSide(toSide, "to join to");
        if (this._joins.get(nFromSide)) {
            throw new Error(`Existing join already present for side ${fromSide}!`);
        }
        this._joins.set(nFromSide, {
            toSide: nToSide,
            ofTilePosition: ofTilePosition
        });
    }

    isEmpty(): boolean {
        return !this._tile;
    }

    placeTile(tile: Tile): TilePosition {
        if (!this.isEmpty()) {
            throw new Error("Can't place a Tile when the TilePosition is already filled!");
        }
        this._tile = tile;
        this._tileRotation = 0;
        return this;
    }

    rotateTile(): void {
        this._tileRotation = ++this._tileRotation % TilePosition.TILE_ROTATION.length;
    }

    private mapRotationToTile(mapFrom: Side): Side {
        return TilePosition.TILE_ROTATION[this._tileRotation].get(mapFrom)!;
    }

    getRotatedSegments(): string {
        return this.tile.getSegments(
            this.mapRotationToTile(Side.SideA),
            this.mapRotationToTile(Side.SideB),
            this.mapRotationToTile(Side.SideC));
    }

    removeTile(): boolean {
        if (this.isEmpty()) {
            return false;
        }
        this._tile = null;
        this._tileRotation = 0;
        return true;
    }

    matches(): boolean {
        if (this.isEmpty()) {
            throw new Error("Can't check if a TilePosition matches when there is no Tile to match from!");
        }
        for (const join of this._joins.entries()) {
            if (!join[1].ofTilePosition.isEmpty()) {
                const mapThisSide = this.mapRotationToTile(join[0]);
                const thisSegment = this.tile.getSideSegments(mapThisSide);
                const mapThatSide = this.mapRotationToTile(join[1].toSide);
                const thatSegment = join[1].ofTilePosition.tile.getSideSegmentsToMatchWith(mapThatSide);
                if (thisSegment !== thatSegment) {
                    return false;
                }
            }
        }
        return true;
    }

}
