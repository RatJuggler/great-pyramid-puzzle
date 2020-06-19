import { Face } from "./face";

export class Tetrahedron {

    private _faces: Face[] = [];
    private _face1: Face;
    private _face2: Face;
    private _face3: Face;
    private _face4: Face;

    constructor(private _name: string, numberOfTilesPerFace: number) {
        this._face1 = new Face("1", numberOfTilesPerFace);
        this._faces.push(this._face1);
        this._face2 = new Face("2", numberOfTilesPerFace);
        this._faces.push(this._face2);
        this._face3 = new Face("3", numberOfTilesPerFace);
        this._faces.push(this._face3);
        this._face4 = new Face("4", numberOfTilesPerFace);
        this._faces.push(this._face4);
        this._face1.join("A", this._face3, "B");
        this._face1.join("B", this._face4, "B");
        this._face1.join("C", this._face2, "B");
        this._face2.join("A", this._face3, "C");
        this._face2.join("B", this._face1, "C");
        this._face2.join("C", this._face4, "A");
        this._face3.join("A", this._face4, "C");
        this._face3.join("B", this._face1, "A");
        this._face3.join("C", this._face2, "A");
        this._face4.join("A", this._face2, "C");
        this._face4.join("B", this._face1, "B");
        this._face4.join("C", this._face3, "A");
    }

    toString(): string {
        let tetrahedronString = `Solving: ${this._name}`;
        this._faces.forEach(face => tetrahedronString += face.toString());
        return tetrahedronString;
    }

    get name(): string {
        return this._name;
    }

}
