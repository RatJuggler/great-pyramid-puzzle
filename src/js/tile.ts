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
    private _rotations: number = 0;

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

    get rotations(): number {
        return this._rotations;
    }

    get segments(): string {
        return this._sideSegments[0].toString();
    }

    placed(): Tile {
        this._rotations = 0;
        return this;
    }

    rotate(): boolean {
        this._rotations = ++this._rotations % 3;
        return this._rotations !== 0;
    }

    getSegmentsForSide(side: Side): string {
        return this._sideSegments[this._rotations][side];
    }

    getSegmentsForSideToMatchWith(side: Side): string {
        const sideSegments = this.getSegmentsForSide(side);
        return sideSegments[3] + sideSegments[2] + sideSegments[1] + sideSegments[0];
    }

    hasSideSegments(findSideSegments: string): boolean {
        for (const segments of this._sideSegments) {
            if (!!segments.toString().match(findSideSegments)) {
                return true;
            }
        }
        return false;
    }

    toString(): string {
        return `Id: ${this._id}, Rotation: ${this._rotations}, ` +
            `Side-A: ${this.getSegmentsForSide(Side.SideA)}, ` +
            `Side-B: ${this.getSegmentsForSide(Side.SideB)}, ` +
            `Side-C: ${this.getSegmentsForSide(Side.SideC)}`;
    }

}
