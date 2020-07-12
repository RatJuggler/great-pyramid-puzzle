import { TileDefinition } from "./tile-data-schema";
import { Side } from "./side";


export class Tile {

    private static readonly ORIENTATION = [
        new Map<Side, Side>([[Side.SideA, Side.SideA], [Side.SideB, Side.SideB], [Side.SideC, Side.SideC]]),
        new Map<Side, Side>([[Side.SideA, Side.SideC], [Side.SideB, Side.SideA], [Side.SideC, Side.SideB]]),
        new Map<Side, Side>([[Side.SideA, Side.SideB], [Side.SideB, Side.SideC], [Side.SideC, Side.SideA]])
    ];

    private readonly _id: number;
    private readonly _sides = new Map<Side, string>() ;
    private _orientation: number = 0;

    validateSegments(segments: string): string {
        if (segments.length !== 4) {
            throw new Error(`Segment coding should be four characters, found '${segments}'!`);
        }
        if (!segments.match(/^[0|1]+$/)) {
            throw new Error(`Segment coding can only contain '1' or '0', found '${segments}'!`);
        }
        return segments;
    }

    constructor(tileDetails: TileDefinition) {
        this._id = tileDetails.tile;
        this._sides.set(Side.SideA, this.validateSegments(tileDetails.sideA));
        this._sides.set(Side.SideB, this.validateSegments(tileDetails.sideB));
        this._sides.set(Side.SideC, this.validateSegments(tileDetails.sideC));
    }

    public getSide(side: Side): string {
        return this._sides.get(Tile.ORIENTATION[this._orientation].get(side)!)!;
    }

    toString(): string {
        return `Id: ${this._id}, Side-A: ${this.getSide(Side.SideA)}, Side-B: ${this.getSide(Side.SideB)}, Side-C: ${this.getSide(Side.SideC)}, Orientation: ${this._orientation}`;
    }

    get id(): number {
        return this._id;
    }

    get segments(): string {
        return this.getSide(Side.SideA) + this.getSide(Side.SideB) + this.getSide(Side.SideC);
    }

    place(): Tile {
        this._orientation = 0;
        return this;
    }

    nextOrientation(): Tile {
        this._orientation = ++this._orientation % Tile.ORIENTATION.length;
        return this;
    }

}
