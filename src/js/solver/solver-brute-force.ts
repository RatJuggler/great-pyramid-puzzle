import { Tetrahedron } from "../puzzle/tetrahedron";
import { TilePool } from "../puzzle/tile-pool";
import { TilePosition } from "../puzzle/tile-position";
import { SolverTileState, SolverState, IterativeSolverBase } from "./solver-iterative-base";


export class BruteForceSolver extends IterativeSolverBase {

    constructor(tetrahedron: Tetrahedron, tilePool: TilePool) {
        super(tetrahedron, tilePool);
    }

    protected createNewState(state: SolverState, newTilePosition: TilePosition): SolverState {
        // Trying every possible tile and rotation combination.
        const newUntriedTiles = new Array<SolverTileState>();
        const newRejectedTiles = new Array<SolverTileState>();
        const untriedTiles = state.untriedTiles.concat(state.rejectedTiles);
        for (const untriedTile of untriedTiles) {
            const newTileState = {
                tile: untriedTile.tile,
                rotations: [0, 1, 2]
            }
            newUntriedTiles.push(newTileState);
        }
        return {
            tilePosition: newTilePosition,
            tileState: null,
            untriedTiles: newUntriedTiles,
            rejectedTiles: newRejectedTiles
        }
    }

}
