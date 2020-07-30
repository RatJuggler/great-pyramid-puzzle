import { buildSolver } from "./solver-factory";
import { Solver } from "./solver-base";
import { WorkerParameters, WorkerResult } from "./common-data-schema";


let solver: Solver;
let stepCounter = 0;

onmessage = function (e) {
    // Extract the parameters from the message.
    const parameters = <WorkerParameters> e.data;
    // Build the solver if required.
    let puzzleChange;
    if (parameters.continue) {
        puzzleChange = solver.forceNextState();
        stepCounter++;
    } else {
        solver = buildSolver(parameters.solverOptions);
        puzzleChange = solver.nextState();
        stepCounter = 1;
    }
    // Run the solver until a solution is found.
    while (!puzzleChange.isSolved() && !puzzleChange.isCompleted()) {
        puzzleChange = solver.nextState();
        stepCounter++;
    }
    // Return the result for display, including the final change.
    const result: WorkerResult = {
        changeCounter: stepCounter,
        finalState: solver.finalState(),
        solvedOrCompleted: puzzleChange
    }
    // @ts-ignore
    postMessage(result);
}
