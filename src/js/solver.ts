import { Tetrahedron } from "./tetrahedron";
import { TilePool } from "./tile-pool";
import { TilePosition } from "./tile-position";
import { getTileSelection, placeTile } from "./app-options";


interface Solver {
    nextState: (id: number, resolve: () => void) => TilePosition | null
}


abstract class SolverBase implements Solver {

    constructor(protected _tetrahedron: Tetrahedron, protected _tilePool: TilePool) {
        if (this._tilePool.tileCount !== this._tetrahedron.tilePositionCount) {
            throw new Error("There must be enough Tiles to cover the Tetrahedron!");
        }
    }

    nextState(_id: number, _resolve: () => void): TilePosition | null {
        return null;
    }

}


class NoMatchingSolver extends SolverBase {

    nextState(id: number, resolve: () => void): TilePosition | null {
        const tile = getTileSelection(this._tilePool);
        if (tile) {
            return  placeTile(tile, this._tetrahedron);
        } else {
            clearInterval(id);
            resolve();
            return null;
        }
    }

}


class BruteForceSolver extends SolverBase {

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

export { Solver, NoMatchingSolver, BruteForceSolver }
