export class Tile {

    constructor(private _segments: string) {}

    display() {
        console.log(`Tile: ${this._segments}`);
    }

    get segments(): string {
        return this._segments;
    }

}
