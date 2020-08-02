import { buildSolver } from "./solver-factory";
import { Solver } from "./solver-base";
import { WorkerParameters, WorkerResult } from "./common-data-schema";


let solver: Solver;
let stepCounter = 0;

function solverWorker(parameters: WorkerParameters): WorkerResult {
    // Build the solver if required.
    let puzzleChange;
    if (parameters.continue) {
        puzzleChange = solver.forceNextState();
        stepCounter++;
    } else {
        solver = buildSolver(parameters.solverOptions);
        puzzleChange = solver.nextState();
        stepCounter = 0;
    }
    // Run the solver until a solution is found.
    while (!puzzleChange.isSolved() && !puzzleChange.isCompleted()) {
        puzzleChange = solver.nextState();
        stepCounter++;
    }
    // Return the result for display, including the final change.
    return {
        solvedOrCompleted: puzzleChange.type,
        stepCounter: stepCounter,
        finalState: solver.finalState()
    }
}

export { solverWorker }
