import { SolverBase } from "./solver-base";
import { PuzzleChange } from "../puzzle-changes";
import { PuzzleComponents } from "../common-data-schema";
import { Tetrahedron } from "../puzzle/tetrahedron";
import { TilePool } from "../puzzle/tile-pool";


export class HumanSolver extends SolverBase {

    protected readonly _tetrahedron: Tetrahedron;
    protected readonly _tilePool: TilePool

    constructor(puzzle: PuzzleComponents) {
        super();
        this._tetrahedron = puzzle.tetrahedron;
        this._tilePool = puzzle.tilePool;
    }

    forceNextState(): PuzzleChange {
        return PuzzleChange.INITIAL;
    }

    initialState(): PuzzleChange {
        const displayChanges = this._tetrahedron.tilePositions
            .map((tilePosition) => SolverBase.empty(tilePosition))
            .concat(this._tilePool.tiles.map((tile) => SolverBase.startDraggable(tile)));
        return SolverBase.current(displayChanges);
    }

    nextState(): PuzzleChange {
        return PuzzleChange.INITIAL;
    }

    stateForDisplay(): Array<PuzzleChange> {
        return [PuzzleChange.INITIAL];
    }

    placeTile(tileId: number, tilePositionId: string): PuzzleChange {
        const tilePosition = this._tetrahedron.getFace(tilePositionId[0]).getTilePosition(tilePositionId[2]);
        if (tilePosition.state.isEmpty()) {
            tilePosition.state.tile = this._tilePool.getTile(tileId);
        }
        return SolverBase.tileDraggable(tilePosition);
    }

    removeTile(tilePositionId: string): PuzzleChange {
        const tilePosition = this._tetrahedron.getFace(tilePositionId[0]).getTilePosition(tilePositionId[2]);
        const tile = tilePosition.state.removeTile();
        this._tilePool.returnTile(tile);
        return SolverBase.startDraggable(tile);
    }

    returnToStart(tileId: number): PuzzleChange {
        const tile = this._tilePool.getTile(tileId);
        const puzzleChange = SolverBase.startDraggable(tile);
        this._tilePool.returnTile(tile);
        return puzzleChange;
    }

    returnToTilePosition(tilePositionId: string) {
        const tilePosition = this._tetrahedron.getFace(tilePositionId[0]).getTilePosition(tilePositionId[2]);
        return SolverBase.tileDraggable(tilePosition);
    }

}
