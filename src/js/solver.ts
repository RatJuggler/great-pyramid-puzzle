import { Tetrahedron } from "./tetrahedron";
import { TilePool } from "./tile-pool";
import { TilePosition } from "./tile-position";
import { getTileSelection, placeTile } from "./app-options";


interface Solver {
    nextState: () => TilePosition | null
}


abstract class SolverBase implements Solver {

    constructor(protected _tetrahedron: Tetrahedron, protected _tilePool: TilePool) {
        if (this._tilePool.tileCount !== this._tetrahedron.tilePositionCount) {
            throw new Error("There must be enough Tiles to cover the Tetrahedron!");
        }
    }

    nextState(): TilePosition | null {
        return null;
    }

}


class NoMatchingSolver extends SolverBase {

    nextState(): TilePosition | null {
        const tile = getTileSelection(this._tilePool);
        if (tile) {
            return  placeTile(tile, this._tetrahedron);
        } else {
            return null;
        }
    }

}


class BruteForceSolver extends SolverBase {

    nextState(): TilePosition | null {
        const tile = this._tilePool.nextTile;
        if (tile) {
            return this._tetrahedron.placeTileSequentially(tile);
        } else {
            return null;
        }
    }

}

export { Solver, NoMatchingSolver, BruteForceSolver }
