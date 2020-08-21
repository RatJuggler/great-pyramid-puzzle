import { TileDefinition } from "./tile-data-schema";
import { Side } from "./side";


class SideSegments {

    constructor(private readonly _sideA: string, private readonly _sideB: string, private readonly _sideC: string) {}

    getSegments(side: Side): string {
        switch (side) {
            case Side.sideA:
                return this._sideA;
            case Side.sideB:
                return this._sideB;
            case Side.sideC:
                return this._sideC;
            default:
                throw new Error("Unexpected value of Side!");
        }
    }

    toString(): string {
        return this._sideA + this._sideB + this._sideC;
    }

}

export class Tile {

    private readonly _id: number;
    private readonly _sideSegments = new Array<SideSegments>();

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
        const segments = new SideSegments(
            this.validateSegments(tileDetails.sideA),
            this.validateSegments(tileDetails.sideB),
            this.validateSegments(tileDetails.sideC));
        this._sideSegments.push(segments);
        this._sideSegments.push(new SideSegments(segments.getSegments(Side.sideC), segments.getSegments(Side.sideA), segments.getSegments(Side.sideB)));
        this._sideSegments.push(new SideSegments(segments.getSegments(Side.sideB), segments.getSegments(Side.sideC), segments.getSegments(Side.sideA)));
    }

    get id(): number {
        return this._id;
    }

    get segments(): string {
        return this._sideSegments[0].toString();
    }

    getSegmentsForSide(rotations: number, side: Side): string {
        return this._sideSegments[rotations].getSegments(side);
    }

    getSegmentsForSideToMatchWith(rotations: number, side: Side): string {
        const sideSegments = this.getSegmentsForSide(rotations, side);
        return sideSegments[3] + sideSegments[2] + sideSegments[1] + sideSegments[0];
    }

    hasSideSegments(findSideSegments: string): Array<number> {
        const onRotations = new Array<number>();
        for (let rotation = 0; rotation < 3; rotation++) {
            if (!!this._sideSegments[rotation].toString().match(findSideSegments)) {
                onRotations.push(rotation);
            }
        }
        return onRotations;
    }

    toString(): string {
        return `Id: ${this._id}, ` +
            `Side-A: ${this.getSegmentsForSide(0, Side.sideA)}, ` +
            `Side-B: ${this.getSegmentsForSide(0, Side.sideB)}, ` +
            `Side-C: ${this.getSegmentsForSide(0, Side.sideC)}`;
    }

}
