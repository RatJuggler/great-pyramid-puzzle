export class Tetrahedron {

    constructor(private _name: string) {}

    display() {
        console.log(`Solving: ${this._name}`);
    }

    get name(): string {
        return this._name;
    }

}
