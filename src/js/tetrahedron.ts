import { Face } from "./face";
import { Tile } from "./tile";

export class Tetrahedron {

    static faceNames = ["A", "B", "C", "D"];

    private _faces: Face[] = [];

    constructor(private _name: string, numberOfTilesPerFace: number) {
        Tetrahedron.faceNames.forEach(faceName => this._faces.push(new Face(faceName, numberOfTilesPerFace)));
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
