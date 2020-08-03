import { Tetrahedron } from "../tetrahedron";
import { TilePool } from "../tile-pool";
import { TilePosition } from "../tile-position";
import { TileState, SolverState, IterativeSolverBase } from "./solver-iterative-base";


export class BruteForceSolver extends IterativeSolverBase {

    constructor(tetrahedron: Tetrahedron, tilePool: TilePool) {
        super(tetrahedron, tilePool);
    }

    protected createNewState(state: SolverState, newTilePosition: TilePosition): SolverState {
        // Trying every possible tile and rotation combination.
        const newUntriedTiles = new Array<TileState>();
        const newRejectedTiles = new Array<TileState>();
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
