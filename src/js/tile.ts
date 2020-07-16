import { TileDefinition } from "./tile-data-schema";
import { Side } from "./side";


export class Tile {

    private readonly _id: number;
    private readonly _sides = new Map<Side, string>() ;

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

    get id(): number {
        return this._id;
    }

    getSegments(side1: Side, side2: Side, side3: Side): string {
        return this.getSideSegments(side1) +
            this.getSideSegments(side2) +
            this.getSideSegments(side3);
    }

    getSideSegments(side: Side): string {
        return this._sides.get(side)!;
    }

    getSideSegmentsToMatchWith(side: Side): string {
        const sideSegments = this.getSideSegments(side);
        return sideSegments[3] + sideSegments[2] + sideSegments[1] + sideSegments[0];
    }

    toString(): string {
        return this.toStringRotated(Side.SideA, Side.SideB, Side.SideC);
    }

    toStringRotated(side1: Side, side2: Side, side3: Side): string {
        return `Id: ${this._id}, ` +
            `Side-A: ${this.getSideSegments(side1)}, ` +
            `Side-B: ${this.getSideSegments(side2)}, ` +
            `Side-C: ${this.getSideSegments(side3)}`;
    }

}
