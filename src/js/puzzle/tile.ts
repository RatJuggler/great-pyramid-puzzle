import { TileDefinition } from "./tile-data-schema";
import { Side } from "./side";


class SideSegments {

    constructor(private readonly _sideA: string, private readonly _sideB: string, private readonly _sideC: string) {}

    get A(): string {
        return this._sideA;
    }

    get B(): string {
        return this._sideB;
    }

    get C(): string {
        return this._sideC;
    }

    toString(): string {
        return this.A + this.B + this.C;
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
        this._sideSegments.push(new SideSegments(segments.C, segments.A, segments.B));
        this._sideSegments.push(new SideSegments(segments.B, segments.C, segments.A));
    }

    get id(): number {
        return this._id;
    }

    get segments(): string {
        return this._sideSegments[0].toString();
    }

    getSegmentsForSide(rotations: number, side: Side): string {
        return this._sideSegments[rotations][side];
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
            `Side-A: ${this.getSegmentsForSide(0, Side.SideA)}, ` +
            `Side-B: ${this.getSegmentsForSide(0, Side.SideB)}, ` +
            `Side-C: ${this.getSegmentsForSide(0, Side.SideC)}`;
    }

}
