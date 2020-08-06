import { TilePosition } from "../puzzle/tile-position";
import { BruteSolverTileState, BruteSolverState, BruteSolverBase } from "./solver-brute-base";
import { PuzzleComponents } from "../common-data-schema";


export class BruteForceSolver extends BruteSolverBase {

    constructor(puzzle: PuzzleComponents) {
        super(puzzle);
    }

    protected createNewState(state: BruteSolverState, newTilePosition: TilePosition): BruteSolverState {
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
            rejectedTiles: new Array<BruteSolverTileState>()
        }
    }

}
