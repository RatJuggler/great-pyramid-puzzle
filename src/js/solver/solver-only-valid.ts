import { PuzzleComponents } from "../common-data-schema";
import { TilePosition } from "../puzzle/tile-position";
import { BruteSolverBase, BruteSolverTileState, BruteSolverState } from "./solver-brute-base";


export class OnlyValidSolver extends BruteSolverBase {

    constructor(puzzle: PuzzleComponents) {
        super(puzzle);
    }

    protected createNewState(state: BruteSolverState, newTilePosition: TilePosition): BruteSolverState {
        // Find existing sides to match.
        const segmentsToFind = newTilePosition.segmentsToFind();
        // Filter the unused tiles so we only try those that are relevant.
        const newUntriedTiles = new Array<BruteSolverTileState>();
        const newRejectedTiles = new Array<BruteSolverTileState>();
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
