import { TileData } from "./puzzle-data-schema";


export class Tile {

    private readonly _id: string;
    private readonly _sideA: string;
    private readonly _sideB: string;
    private readonly _sideC: string;

    constructor(tileDetails: TileData) {
        this._id = tileDetails.tile;
        this._sideA = tileDetails.sideA;
        this._sideB = tileDetails.sideB;
        this._sideC = tileDetails.sideC;
    }

    toString(): string {
        return `Tile: ${this._id}, Side-A: ${this._sideA}, Side-B: ${this._sideB}, Side-C: ${this._sideC}`;
    }

    get id(): string {
        return this._id;
    }

}
