export class Face {

    static validTileCounts = [1, 4, 9];

    constructor(private _id: string, private _numberOfTiles: number) {
        if (!(Face.validTileCounts.includes(_numberOfTiles))) {
            throw new Error(`Number of tiles on a Face must be one of ${(Face.validTileCounts)}!`);
        }
    }

    display() {
        console.log(`Face: ${this._id} - Tiles: ${this._numberOfTiles}`);
    }

    get id(): string {
        return this._id;
    }

    get numberOfTiles(): number {
        return this._numberOfTiles;
    }

}
