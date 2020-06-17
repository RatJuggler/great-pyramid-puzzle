export class Face {

    constructor(private _id: string, private _number_of_tiles: number) {
        const valid_tile_counts = [1, 4, 9];
        if (!(valid_tile_counts.includes(_number_of_tiles))) {
            throw new Error(`Number of tiles on a Face must be one of ${valid_tile_counts}!`);
        }
    }

    display() {
        console.log(`Face: ${this._id} - Tiles: ${this._number_of_tiles}`);
    }

    get id(): string {
        return this._id;
    }

    get numberOfTiles(): number {
        return this._number_of_tiles;
    }

}
