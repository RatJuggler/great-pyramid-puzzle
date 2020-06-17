export class Face {

    constructor(private _id: string) {}

    display() {
        console.log(`Face: ${this._id}`);
    }

    get id(): string {
        return this._id;
    }

}
