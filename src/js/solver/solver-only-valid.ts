import { Tetrahedron } from "../tetrahedron";
import { TilePool } from "../tile-pool";
import { TilePosition } from "../tile-position";
import { TileState, SolverState, IterativeSolverBase } from "./solver-iterative-base";


export class OnlyValidSolver extends IterativeSolverBase {

    constructor(tetrahedron: Tetrahedron, tilePool: TilePool) {
        super(tetrahedron, tilePool);
    }

    protected createNewState(state: SolverState, newTilePosition: TilePosition): SolverState {
        // Find existing sides to match.
        const segmentsToFind = newTilePosition.segmentsToFind();
        // Filter the unused tiles so we only try those that are relevant.
        const newUntriedTiles = new Array<TileState>();
        const newRejectedTiles = new Array<TileState>();
        const untriedTiles = state.untriedTiles.concat(state.rejectedTiles);
        for (const untriedTile of untriedTiles) {
            const newTileState = {
                tile: untriedTile.tile,
                rotations: untriedTile.tile.hasSideSegments(segmentsToFind)
            }
            if (newTileState.rotations.length > 0) {
                newUntriedTiles.push(newTileState);
            } else {
                newRejectedTiles.push(newTileState);
            }
        }
        return {
            tilePosition: newTilePosition,
            tileState: null,
            untriedTiles: newUntriedTiles,
            rejectedTiles: newRejectedTiles
        }
    }

}
