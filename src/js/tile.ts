import { TileDefinition } from "./tile-data-schema";
import { Sides } from "./common-data-schema";


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

    public getSide(side: Sides): string {
        return this._sides[Tile.ORIENTATION[this._orientation][side.valueOf()]];
    }

    toString(): string {
        return `Id: ${this._id}, Side-A: ${this.getSide(Sides.SideA)}, Side-B: ${this.getSide(Sides.SideB)}, Side-C: ${this.getSide(Sides.SideC)}, Orientation: ${this._orientation}`;
    }

    get id(): number {
        return this._id;
    }

    get segments(): string {
        return this.getSide(Sides.SideA) + this.getSide(Sides.SideB) + this.getSide(Sides.SideC);
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
