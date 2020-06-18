import { Face } from "./face";
import { Tile } from "./tile";

export class Tetrahedron {

    private _faces: Face[] = [];
    private _faceA: Face;
    private _faceB: Face;
    private _faceC: Face;
    private _faceD: Face;

    constructor(private _name: string, numberOfTilesPerFace: number) {
        this._faceA = new Face("A", numberOfTilesPerFace);
        this._faces.push(this._faceA);
        this._faceB = new Face("B", numberOfTilesPerFace);
        this._faces.push(this._faceB);
        this._faceC = new Face("C", numberOfTilesPerFace);
        this._faces.push(this._faceC);
        this._faceD = new Face("D", numberOfTilesPerFace);
        this._faces.push(this._faceD);
        this._faceA.joinSideWith("1", this._faceC, "2");
        this._faceA.joinSideWith("2", this._faceD, "2");
        this._faceA.joinSideWith("3", this._faceB, "2");
        this._faceB.joinSideWith("1", this._faceC, "3");
        this._faceB.joinSideWith("2", this._faceA, "2");
        this._faceB.joinSideWith("3", this._faceD, "1");
        this._faceC.joinSideWith("1", this._faceD, "3");
        this._faceC.joinSideWith("2", this._faceA, "1");
        this._faceC.joinSideWith("3", this._faceB, "1");
        this._faceD.joinSideWith("1", this._faceB, "3");
        this._faceD.joinSideWith("2", this._faceA, "2");
        this._faceD.joinSideWith("3", this._faceC, "1");
    }

    display() {
        console.log(`Solving: ${this._name}`);
        this._faces.forEach(face => face.display());
    }

    get name(): string {
        return this._name;
    }

    get faces(): Face[] {
        return this._faces;
    }

    addTile(tile: Tile): void {
        this._faces[0].addTile(tile);
    }

}
