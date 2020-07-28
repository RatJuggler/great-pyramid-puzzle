import { buildSolver, SolverOptions } from "./solver-factory";


onmessage = function (e) {
    // Extract the options form the message.
    const solverOptions = <SolverOptions> e.data;
    // Build the solver to use.
    const solver = buildSolver(solverOptions);
    // Count the changes.
    let changeCounter = 1;
    // Run the solver until a solution is found.
    let puzzleChange = solver.nextState();
    while (!puzzleChange.isSolved()) {
        puzzleChange = solver.nextState();
        changeCounter++;
    }
    // Return the result for display.
    const result = {
        changeCounter: changeCounter,
        finalState: solver.finalState()
    }
    // @ts-ignore
    postMessage(result);
}
