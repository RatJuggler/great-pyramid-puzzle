import { Tetrahedron } from "./tetrahedron";
import { Tile } from "./tile";
import { TilePool } from "./tile-pool";
import { TilePosition } from "./tile-position";
import { getRandomInt } from "./utils";


interface Solver {
    nextState: () => TilePosition | null
}


abstract class SolverBase implements Solver {

    constructor(protected _tetrahedron: Tetrahedron, protected _tilePool: TilePool) {
        if (this._tilePool.tileCount !== this._tetrahedron.tilePositionCount) {
            throw new Error("There must be enough Tiles to cover the Tetrahedron!");
        }
    }

    getTileSelection(tileSelection: string): Tile {
        switch (tileSelection) {
            case "Random":
                return this._tilePool.randomTile;
            case "Sequential":
                return this._tilePool.nextTile;
            case "Test":
                return this._tilePool.testTile;
            default:
                throw new Error("Invalid tile selection option!");
        }
    }

    private static rotateTile(tilePosition: TilePosition, tileRotation: string): TilePosition {
        switch (tileRotation) {
            case "None":
                return tilePosition;
            case "Random":
                for (let i = getRandomInt(3); i > 0; --i) {
                    tilePosition.rotateTile();
                }
                return tilePosition;
            default:
                throw new Error("Invalid tile rotation option!");
        }
    }

    placeTile(tile: Tile, tilePlacement: string, tileRotation: string): TilePosition  {
        let tilePlacedPosition;
        switch (tilePlacement) {
            case "Random":
                tilePlacedPosition = this._tetrahedron.placeTileRandomly(tile);
                break;
            case "Sequential":
                tilePlacedPosition = this._tetrahedron.placeTileSequentially(tile);
                break;
            default:
                throw new Error("Invalid tile placement option!");
        }
        if (!tilePlacedPosition) {
            throw new Error("Failed to place tile on puzzle!");
        }
        return SolverBase.rotateTile(tilePlacedPosition, tileRotation);
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
        const tile = this.getTileSelection(this._tileSelection);
        return this.placeTile(tile, this._tilePlacement, this._tileRotation);
    }

}


class BruteForceSolver extends SolverBase {

    private readonly _emptyTilePositions: Array<TilePosition>;
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
            tilePosition.removeTile();
            rejectedTiles.push(tile);
        }
        emptyTilePositions.unshift(tilePosition);
        return false;
    }

    nextState(): TilePosition | null {
        this.nextTilePosition(this._emptyTilePositions, this._unusedTiles);
        return null;
    }

}

export { Solver, SolverBase, NoMatchingSolver, BruteForceSolver }
