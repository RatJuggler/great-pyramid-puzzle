import { Tetrahedron } from "./tetrahedron";
import { TilePool } from "./tile-pool";
import { Tile } from "./tile";
import { TilePosition } from "./tile-position";
import { SolverState, IterativeSolverBase } from "./solver-iterative-base";


export class BruteForceSolver extends IterativeSolverBase {

    constructor(tetrahedron: Tetrahedron, tilePool: TilePool) {
        super(tetrahedron, tilePool);
    }

    protected createNewState(state: SolverState, newTilePosition: TilePosition): SolverState {
        return {
            tilePosition: newTilePosition,
            untriedTiles: state.untriedTiles.concat(state.rejectedTiles),
            rejectedTiles: new Array<Tile>()
        }
    }

}
