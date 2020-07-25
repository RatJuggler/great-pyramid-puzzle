import {TileDefinition} from "./tile-data-schema";
import {Side} from "./side";


export class Tile {

    private static readonly ROTATION_MAP = [
        new Map<Side, Side>([[Side.SideA, Side.SideA], [Side.SideB, Side.SideB], [Side.SideC, Side.SideC]]),
        new Map<Side, Side>([[Side.SideA, Side.SideC], [Side.SideB, Side.SideA], [Side.SideC, Side.SideB]]),
        new Map<Side, Side>([[Side.SideA, Side.SideB], [Side.SideB, Side.SideC], [Side.SideC, Side.SideA]])
    ];

    private readonly _id: number;
    private readonly _sideSegments = new Map<Side, string>();
    private _sideValues: Array<string>;
    private _rotation: number = 0;

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
        this._sideSegments.set(Side.SideA, this.validateSegments(tileDetails.sideA));
        this._sideSegments.set(Side.SideB, this.validateSegments(tileDetails.sideB));
        this._sideSegments.set(Side.SideC, this.validateSegments(tileDetails.sideC));
        this._sideValues = Array.from(this._sideSegments.values());
    }

    get id(): number {
        return this._id;
    }

    placed(): Tile {
        this._rotation = 0;
        return this;
    }

    rotate(): boolean {
        this._rotation = ++this._rotation % this._sideSegments.size;
        return this._rotation !== 0;
    }

    private mapRotationToTile(mapFrom: Side): Side {
        return Tile.ROTATION_MAP[this._rotation].get(mapFrom)!;
    }

    getSideSegments(side: Side): string {
        const sideRotated = this.mapRotationToTile(side);
        return this._sideSegments.get(sideRotated)!;
    }

    getSegments(): string {
        return this.getSideSegments(Side.SideA) +
            this.getSideSegments(Side.SideB) +
            this.getSideSegments(Side.SideC);
    }

    getSideSegmentsToMatchWith(side: Side): string {
        const sideSegments = this.getSideSegments(side);
        return sideSegments[3] + sideSegments[2] + sideSegments[1] + sideSegments[0];
    }

    hasSideSegments(findSideSegments: Array<string>): boolean {
        for (const findSegments of findSideSegments as Array<string>) {
            if (this._sideValues.includes(findSegments)) {
                return true;
            }
        }
        return false;
    }

    toString(): string {
        return `Id: ${this._id}, Rotation: ${this._rotation}, ` +
            `Side-A: ${this.getSideSegments(Side.SideA)}, ` +
            `Side-B: ${this.getSideSegments(Side.SideB)}, ` +
            `Side-C: ${this.getSideSegments(Side.SideC)}`;
    }

}
