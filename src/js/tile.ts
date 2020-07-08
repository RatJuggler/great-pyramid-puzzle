import { TileDefinition } from "./tile-data-schema";


export class Tile {

    private static readonly ORIENTATION = [ [0, 1, 2], [2, 0, 1], [1, 2, 0] ];

    private readonly _id: number;
    private readonly _sides: string[];
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
        this._sides = [
            this.validateSegments(tileDetails.sideA),
            this.validateSegments(tileDetails.sideB),
            this.validateSegments(tileDetails.sideC)
        ];
    }

    private getSide(side: number): string {
        return this._sides[Tile.ORIENTATION[this._orientation][side]];
    }

    toString(): string {
        return `Id: ${this._id}, Side-A: ${this.getSide(0)}, Side-B: ${this.getSide(1)}, Side-C: ${this.getSide(2)}, Orientation: ${this._orientation}`;
    }

    get id(): number {
        return this._id;
    }

    get segments(): string {
        return this.getSide(0) + this.getSide(1) + this.getSide(2);
    }

    place(): Tile {
        this._orientation = 0;
        return this;
    }

    nextOrientation(): Tile {
        this._orientation = ++this._orientation % this._sides.length;
        return this;
    }

}
