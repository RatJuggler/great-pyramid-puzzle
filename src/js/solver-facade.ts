import { PuzzleChange} from "./puzzle-changes";
import { StatusList, StatusListManager } from "./status-list-manager";
import { SolverTimer } from "./solver-timer";
import { SolverStepCounter } from "./solver-step-counter";
import { buildSolver, SolverOptions } from "./solver-factory";
import { DisplayManager } from "./display-manager";
import { Solver } from "./solver-base";
import { WorkerParameters, WorkerResult } from "./common-data-schema";


abstract class SolverFacade {

    // Status list manager.
    private readonly statusList: StatusList = new StatusListManager("status-list");
    // Track how long solvers run for.
    private readonly solverTimer: SolverTimer = new SolverTimer(this.statusList);
    // Track how many steps they take.
    private readonly stepCounter: SolverStepCounter = new SolverStepCounter(this.statusList);

    protected constructor(protected readonly solverOptions: SolverOptions,
                          protected readonly displayManager: DisplayManager) {}

    protected abstract clear(): void;

    protected abstract startSolver(): void;

    protected abstract continueSolver(): void;

    start(): void {
        this.displayManager.display(PuzzleChange.INITIAL);
        this.statusList.clear();
        this.solverTimer.start();
        this.stepCounter.start();
        this.startSolver();
    }

    cancel(): void {
        this.clear();
        this.solverTimer.cancel();
    }

    continue(): void {
        this.solverTimer.continue();
        this.continueSolver();
    }

    protected stop(): void {
        this.solverTimer.stop();
    }

    protected stepCount(): void {
        this.stepCounter.increase();
    }

    protected overrideCounter(newCount: number): void {
        this.stepCounter.counter = newCount;
    }

}

class AnimatedFacade extends SolverFacade {

    // Track solver animation timeout.
    private animationTimeoutId: number = 0;
    // The solver being used.
    private solver: Solver = buildSolver(this.solverOptions);

    constructor(solverOptions: SolverOptions, displayManager: DisplayManager, private _animationDuration: number = 250) {
        super(solverOptions, displayManager);
    }

    protected clear(): void {
        if (this.animationTimeoutId) {
            clearInterval(this.animationTimeoutId);
            this.animationTimeoutId = 0;
        }
    }

    private runAnimatedSolver(): void {
        // Schedule a series of events to animate placing tiles on the puzzle.
        this.animationTimeoutId = setTimeout( () => {
            const puzzleChange = this.solver.nextState();
            if (puzzleChange.isSolved() || puzzleChange.isCompleted()) {
                // Stop the timer and show the final result.
                this.clear();
                this.stop();
                this.displayManager.display(puzzleChange);
            } else {
                this.displayManager.display(puzzleChange);
                this.stepCount()
                this.runAnimatedSolver();
            }
        }, this._animationDuration + 20);
    }

    protected startSolver(): void {
        // Show the initial tile positions.
        this.solver.initialState().forEach((tpChange) => this.displayManager.display(tpChange));
        // Kick off the animated solver.
        this.runAnimatedSolver();
    }

    protected continueSolver(): void {
        this.runAnimatedSolver();
    }

}

class WorkerFacade extends SolverFacade {

    // Track solver worker.
    private solverWorker: Worker = new Worker("solver-worker.ts");

    constructor(solverOptions: SolverOptions, displayManager: DisplayManager, private _overlay: HTMLElement) {
        super(solverOptions, displayManager);
        // Attach a cancel trigger to the overlay.
        this._overlay.addEventListener("click", () => {
            this.cancel();
            this.disableOverlay();
        });
        // Attach an event to the worker to deal with the result.
        this.solverWorker.onmessage = (e) => {
            // Once complete, stop, show the returned result and then disable the overlay.
            this.stop();
            const result = <WorkerResult> e.data;
            this.overrideCounter(result.changeCounter);
            result.finalState.forEach((tpChange) => this.displayManager.display(tpChange));
            this.disableOverlay();
        }
    }

    protected clear(): void {
        if (this.solverWorker) {
            this.solverWorker.terminate();
        }
    }

    private enableOverlay(): void {
        this._overlay.classList.add("active");
    }

    private disableOverlay(): void {
        this._overlay.classList.remove("active");
    }

    protected startSolver(): void {
        // Set the overlay to prevent further UI interaction.
        this.enableOverlay();
        // Kick off the worker with a new solver.
        const parameters: WorkerParameters = {
            newSolver: true,
            solverOptions: this.solverOptions
        }
        this.solverWorker.postMessage(parameters);
    }

    protected continueSolver() {
        // Set the overlay to prevent further UI interaction.
        this.enableOverlay();
        // Kick off the worker with an existing solver.
        const parameters: WorkerParameters = {
            newSolver: false,
            solverOptions: this.solverOptions
        }
        this.solverWorker.postMessage(parameters);
    }

}

export { SolverFacade, AnimatedFacade, WorkerFacade }
