import { buildSolver, SolverOptions } from "./solver-factory";


onmessage = function (e) {
    // Extract the options form the message.
    const solverOptions = <SolverOptions> e.data;
    // Build the solver to use.
    const solver = buildSolver(solverOptions);
    // Run the solver until a solution is found.
    let puzzleChange = solver.nextState();
    while (!puzzleChange.isSolved()) {
        puzzleChange = solver.nextState();
    }
    // Return the result for display.
    // @ts-ignore
    postMessage(solver.finalState());
}
