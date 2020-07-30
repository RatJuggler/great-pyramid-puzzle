import { buildSolver } from "./solver-factory";
import { Solver } from "./solver-base";
import { WorkerParameters, WorkerResult } from "./common-data-schema";


let solver: Solver;
let stepCounter = 0;

onmessage = function (e) {
    // Extract the parameters from the message.
    const parameters = <WorkerParameters> e.data;
    // Build the solver if required.
    if (parameters.newSolver) {
        solver = buildSolver(parameters.solverOptions);
        stepCounter = 0;
    }
    // Run the solver until a solution is found.
    let puzzleChange;
    do {
        puzzleChange = solver.nextState();
        stepCounter++;
    } while (!puzzleChange.isSolved() && !puzzleChange.isCompleted());
    // Return the result for display, including the final change.
    const finalState = solver.finalState();
    finalState.push(puzzleChange)
    const result: WorkerResult = {
        changeCounter: stepCounter,
        finalState: finalState
    }
    // @ts-ignore
    postMessage(result);
}
