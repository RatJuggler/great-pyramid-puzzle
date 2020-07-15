import { Tetrahedron } from "./tetrahedron";
import { TilePool } from "./tile-pool";
import { TilePosition } from "./tile-position";
import { getTileSelection, placeTile} from "./app-options";


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

    constructor(tetrahedron: Tetrahedron, tilePool: TilePool,
                private _tileSelection: string, private _tilePlacement: string, private _tileRotation: string) {
        super(tetrahedron, tilePool);
    }

    nextState(): TilePosition | null {
        const tile = getTileSelection(this._tilePool, this._tileSelection);
        if (tile) {
            return  placeTile(tile, this._tetrahedron, this._tilePlacement, this._tileRotation);
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

export { Solver, SolverBase, NoMatchingSolver, BruteForceSolver }
