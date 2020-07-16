import { Tetrahedron } from "./tetrahedron";
import { Tile } from "./tile";
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

    constructor(tetrahedron: Tetrahedron, tilePool: TilePool,
                private _tileSelection: string, private _tilePlacement: string, private _tileRotation: string) {
        super(tetrahedron, tilePool);
    }

    nextState(): TilePosition | null {
        if (this._tilePool.isEmpty) {
            return null;
        }
        const tile = getTileSelection(this._tilePool, this._tileSelection);
        return placeTile(tile, this._tetrahedron, this._tilePlacement, this._tileRotation);
    }

}


class BruteForceSolver extends SolverBase {

    private _emptyTilePositions: Array<TilePosition>;
    private _unusedTiles: Array<Tile> = [];

    constructor(tetrahedron: Tetrahedron, tilePool: TilePool) {
        super(tetrahedron, tilePool);
        this._emptyTilePositions = this._tetrahedron.emptyTilePositions;
        while (!this._tilePool.isEmpty) {
            this._unusedTiles.push(this._tilePool.nextTile);
        }
    }

    nextTilePosition(emptyTilePositions: Array<TilePosition>, unusedTiles: Array<Tile>): boolean {
        if (emptyTilePositions.length === 0) {
            return true;
        }
        const tilePosition = emptyTilePositions.shift()!;
        console.log("On: " + tilePosition.toString());
        const untriedTiles = [...unusedTiles];
        const rejectedTiles = new Array<Tile>();
        while (untriedTiles.length > 0) {
            const tile = untriedTiles.shift()!;
            tilePosition.placeTile(tile);
            if (tilePosition.matches()) {
                console.log("Matched: " + tilePosition.toString());
                const unusedTilesNow = untriedTiles.concat(rejectedTiles);
                if (this.nextTilePosition(emptyTilePositions, unusedTilesNow)) {
                    return true;
                }
            }
            tilePosition.rotateTile();
            if (tilePosition.matches()) {
                console.log("Matched: " + tilePosition.toString());
                const unusedTilesNow = untriedTiles.concat(rejectedTiles);
                if (this.nextTilePosition(emptyTilePositions, unusedTilesNow)) {
                    return true;
                }
            }
            tilePosition.rotateTile();
            if (tilePosition.matches()) {
                console.log("Matched: " + tilePosition.toString());
                const unusedTilesNow = untriedTiles.concat(rejectedTiles);
                if (this.nextTilePosition(emptyTilePositions, unusedTilesNow)) {
                    return true;
                }
            }
            console.log("No Match: " + tilePosition.toString());
            tilePosition.removeTile();
            rejectedTiles.push(tile);
        }
        console.log("No Tile: " + tilePosition.toString());
        emptyTilePositions.unshift(tilePosition);
        return false;
    }

    nextState(): TilePosition | null {
        this.nextTilePosition(this._emptyTilePositions, this._unusedTiles);
        return null;
    }

}

export { Solver, SolverBase, NoMatchingSolver, BruteForceSolver }