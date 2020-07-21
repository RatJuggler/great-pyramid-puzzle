import { Tetrahedron } from "./tetrahedron";
import { Tile } from "./tile";
import { TilePool } from "./tile-pool";
import { TilePosition } from "./tile-position";
import { TilePositionChange, TileChange } from "./tile-position-change";
import { getRandomInt } from "./utils";


interface Solver {
    nextState: () => TilePositionChange | null;
    finalState: () => Array<TilePositionChange>;
}


abstract class SolverBase implements Solver {

    constructor(protected _tetrahedron: Tetrahedron, protected _tilePool: TilePool) {
        if (this._tilePool.tileCount !== this._tetrahedron.tilePositionCount) {
            throw new Error("There must be enough Tiles to cover the Tetrahedron!");
        }
    }

    protected static createTileChange(type: string, tilePosition: TilePosition): TilePositionChange {
        return new TileChange(type, tilePosition.id, tilePosition.tile.id, tilePosition.getRotatedSegments());
    }

    protected static createTilePositionChange(type: string, tilePosition: TilePosition): TilePositionChange {
        return new TilePositionChange(type, tilePosition.id);
    }

    nextState(): TilePositionChange | null {
        return null;
    }

    finalState(): Array<TilePositionChange> {
        return this._tetrahedron.tilePositions
            .map((tilePosition) => SolverBase.createTileChange("Final", tilePosition));
    }

}


class NoMatchingSolver extends SolverBase {

    private _tilePosition: TilePosition | null = null;
    private _rotating: number = 0;

    constructor(tetrahedron: Tetrahedron, tilePool: TilePool,
                private _tileSelection: string, private _tilePlacement: string, private _tileRotation: string) {
        super(tetrahedron, tilePool);
    }

    getTileSelection(): Tile {
        switch (this._tileSelection) {
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

    tileRotations(): number {
        switch (this._tileRotation) {
            case "None":
                return 0;
            case "Random":
                return getRandomInt(3);
            default:
                throw new Error("Invalid tile rotation option!");
        }
    }

    placeTile(tile: Tile): TilePosition  {
        let tilePlacedPosition;
        switch (this._tilePlacement) {
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
        return tilePlacedPosition;
    }

    nextState(): TilePositionChange | null {
        if (this._rotating > 0) {
            if (this._tilePosition === null) {
                throw new Error("No tile to rotate!");
            }
            this._rotating--;
            this._tilePosition.rotateTile();
            return SolverBase.createTilePositionChange("Rotate", this._tilePosition);
        }
        if (this._tilePool.isEmpty) {
            return null;
        }
        const tile = this.getTileSelection();
        this._tilePosition = this.placeTile(tile);
        this._rotating = this.tileRotations();
        return SolverBase.createTileChange("Place", this._tilePosition);
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

    nextState(): TilePositionChange | null {
        this.nextTilePosition(this._emptyTilePositions, this._unusedTiles);
        return null;
    }

}

export { Solver, SolverBase, NoMatchingSolver, BruteForceSolver }
