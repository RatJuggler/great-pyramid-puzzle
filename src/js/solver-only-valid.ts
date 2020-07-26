import { Tetrahedron } from "./tetrahedron";
import { TilePool } from "./tile-pool";
import { Tile } from "./tile";
import { TilePosition } from "./tile-position";
import { SolverState, IterativeSolverBase } from "./solver-iterative-base";


export class OnlyValidSolver extends IterativeSolverBase {

    constructor(tetrahedron: Tetrahedron, tilePool: TilePool) {
        super(tetrahedron, tilePool);
    }

    protected createNewState(state: SolverState, newTilePosition: TilePosition): SolverState {
        // Find existing sides to match.
        const segmentsToFind = newTilePosition.segmentsToFind();
        // Filter the unused tiles so we only try those that are relevant.
        const newUntriedTiles = new Array<Tile>();
        const newRejectedTiles = new Array<Tile>();
        const untriedTiles = state.untriedTiles.concat(state.rejectedTiles);
        for (const untriedTile of untriedTiles) {
            if (untriedTile.hasSideSegments(segmentsToFind)) {
                newUntriedTiles.push(untriedTile);
            } else {
                newRejectedTiles.push(untriedTile);
            }
        }
        return {
            tilePosition: newTilePosition,
            untriedTiles: newUntriedTiles,
            rejectedTiles: newRejectedTiles
        }
    }

}
