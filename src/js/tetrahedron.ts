import { Face } from "./face";
import { Tile } from "./tile";

export class Tetrahedron {

    static faceIds = ["A", "B", "C", "D"];

    private _faces: Face[] = [];

    constructor(private _name: string, numberOfTiles: number) {
        Tetrahedron.faceIds.forEach(faceId => this._faces.push(new Face(faceId, numberOfTiles)));
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
