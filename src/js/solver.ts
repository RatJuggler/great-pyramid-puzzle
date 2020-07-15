import { Tetrahedron } from "./tetrahedron";
import { TilePool } from "./tile-pool";
import { TilePosition } from "./tile-position";


interface Solver {
    nextState: (id: number, resolve: () => void) => TilePosition | null
}


class BruteForceSolver implements Solver {

    constructor(private _tetrahedron: Tetrahedron, private _tilePool: TilePool) {
        if (this._tilePool.tileCount !== this._tetrahedron.tilePositionCount) {
            throw new Error("There must be enough Tiles to cover the Tetrahedron!");
        }
    }

    nextState(id: number, resolve: () => void): TilePosition | null {
        const tile = this._tilePool.nextTile;
        if (tile) {
            return this._tetrahedron.placeTileSequentially(tile);
        } else {
            clearInterval(id);
            resolve();
            return null;
        }
    }

}

export { Solver, BruteForceSolver }
