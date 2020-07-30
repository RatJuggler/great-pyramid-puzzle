import { buildSolver, SolverOptions } from "./solver-factory";


onmessage = function (e) {
    // Extract the options from the message.
    const solverOptions = <SolverOptions> e.data;
    // Build the solver to use.
    const solver = buildSolver(solverOptions);
    // Count how many steps it goes through..
    let stepCounter = 1;
    // Run the solver until a solution is found.
    let puzzleChange = solver.nextState();
    while (!puzzleChange.isSolved()) {
        puzzleChange = solver.nextState();
        stepCounter++;
    }
    // Return the result for display, including the final change.
    const finalState = solver.finalState();
    finalState.push(puzzleChange)
    const result = {
        changeCounter: stepCounter,
        finalState: finalState
    }
    // @ts-ignore
    postMessage(result);
}
