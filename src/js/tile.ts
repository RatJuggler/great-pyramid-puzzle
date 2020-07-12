import { TileDefinition } from "./tile-data-schema";
import { Side, SIDES } from "./side";


export class Tile {

    private static readonly ORIENTATION = [
        new Map<Side, Side>([[SIDES.sideA, SIDES.sideA], [SIDES.sideB, SIDES.sideB], [SIDES.sideC, SIDES.sideC]]),
        new Map<Side, Side>([[SIDES.sideA, SIDES.sideC], [SIDES.sideB, SIDES.sideA], [SIDES.sideC, SIDES.sideB]]),
        new Map<Side, Side>([[SIDES.sideA, SIDES.sideB], [SIDES.sideB, SIDES.sideC], [SIDES.sideC, SIDES.sideA]])
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
        this._sides.set(SIDES.sideA, this.validateSegments(tileDetails.sideA));
        this._sides.set(SIDES.sideB, this.validateSegments(tileDetails.sideB));
        this._sides.set(SIDES.sideC, this.validateSegments(tileDetails.sideC));
    }

    public getSide(side: Side): string {
        return this._sides.get(Tile.ORIENTATION[this._orientation].get(side)!)!;
    }

    toString(): string {
        return `Id: ${this._id}, Side-A: ${this.getSide(SIDES.sideA)}, Side-B: ${this.getSide(SIDES.sideB)}, Side-C: ${this.getSide(SIDES.sideC)}, Orientation: ${this._orientation}`;
    }

    get id(): number {
        return this._id;
    }

    get segments(): string {
        return this.getSide(SIDES.sideA) + this.getSide(SIDES.sideB) + this.getSide(SIDES.sideC);
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
