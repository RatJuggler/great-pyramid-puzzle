import {buildSolver, SolverOptions} from "./solver-factory";


onmessage = function (e) {
    const solverOptions = <SolverOptions> e.data;
    // Build the solver to use.
    const solver = buildSolver(solverOptions);
    while (solver.nextState()) {}
    // @ts-ignore
    postMessage(solver.finalState());
}
