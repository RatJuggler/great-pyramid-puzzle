import { TilePosition } from "../puzzle/tile-position";
import { SolverTileState, SolverState, BruteSolverBase } from "./solver-brute-base";
import { PuzzleComponents } from "../common-data-schema";


export class BruteForceSolver extends BruteSolverBase {

    constructor(puzzle: PuzzleComponents) {
        super(puzzle);
    }

    protected createNewState(state: SolverState, newTilePosition: TilePosition): SolverState {
        // Trying every possible tile and rotation combination.
        const untriedTiles = state.untriedTiles.concat(state.rejectedTiles);
        const newUntriedTiles = untriedTiles.map((untriedTile) => {
            return  {
                tile: untriedTile.tile,
                rotations: [0, 1, 2]
            }
        });
        return {
            tilePosition: newTilePosition,
            tileState: null,
            untriedTiles: newUntriedTiles,
            rejectedTiles: new Array<SolverTileState>()
        }
    }

}
