import { TileDefinition } from "./tile-data-schema";
import { Side, SIDES } from "./side";

// This is complicated by the face we've defined the puzzle data using sides A/B/C but when
// working with the Tile orientation it's been simpler to use 0/1/2 to index the array.


export class Tile {

    private static readonly ORIENTATION = [
        [SIDES.sideA, SIDES.sideB, SIDES.sideC],
        [SIDES.sideC, SIDES.sideA, SIDES.sideB],
        [SIDES.sideB, SIDES.sideC, SIDES.sideA]
    ];

    private readonly _id: number;
    private readonly _sides: string[];
    private _orientation: Side = SIDES.sideA;

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
        this._sides = [
            this.validateSegments(tileDetails.sideA),
            this.validateSegments(tileDetails.sideB),
            this.validateSegments(tileDetails.sideC)
        ];
    }

    public getSide(side: Side): string {
        return this._sides[Tile.ORIENTATION[this._orientation.value][side.value].value];
    }

    toString(): string {
        return `Id: ${this._id}, Side-A: ${this.getSide(SIDES.sideA)}, Side-B: ${this.getSide(SIDES.sideB)}, Side-C: ${this.getSide(SIDES.sideC)}, Orientation: ${this._orientation.value}`;
    }

    get id(): number {
        return this._id;
    }

    get segments(): string {
        return this.getSide(SIDES.sideA) + this.getSide(SIDES.sideB) + this.getSide(SIDES.sideC);
    }

    place(): Tile {
        this._orientation = SIDES.sideA;
        return this;
    }

    nextOrientation(): Tile {
        this._orientation = SIDES.nextSide(this._orientation);
        return this;
    }

}
