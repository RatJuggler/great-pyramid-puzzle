export class Tile {

    constructor(private _segments: string) {}

    display() {
        console.log(this._segments);
    }

    get segments(): string {
        return this._segments;
    }

}
