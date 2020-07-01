import { TileData } from "./puzzle-data-schema";


export class Tile {

    private readonly _id: number;
    private readonly _sideA: string;
    private readonly _sideB: string;
    private readonly _sideC: string;

    validateSegments(segments: string): string {
        if (segments.length !== 4) {
            throw new Error(`Segment coding should be four characters, found '${segments}'!`);
        }
        if (!segments.match(/^[0|1]+$/)) {
            throw new Error(`Segment coding can only contain '1' or '0', found '${segments}'!`);
        }
        return segments;
    }

    constructor(tileDetails: TileData) {
        this._id = tileDetails.tile;
        this._sideA = this.validateSegments(tileDetails.sideA);
        this._sideB = this.validateSegments(tileDetails.sideB);
        this._sideC = this.validateSegments(tileDetails.sideC);
    }

    toString(): string {
        return `Id: ${this._id}, Side-A: ${this._sideA}, Side-B: ${this._sideB}, Side-C: ${this._sideC}`;
    }

    get id(): number {
        return this._id;
    }

    get segments(): string {
        return this._sideA + this._sideB + this._sideC;
    }

}
