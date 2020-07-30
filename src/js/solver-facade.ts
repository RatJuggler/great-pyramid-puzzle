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
    private readonly _statusList: StatusList = new StatusListManager("status-list");
    // Track how long solvers run for.
    private readonly _solverTimer: SolverTimer = new SolverTimer(this._statusList);
    // Track how many steps they take.
    private readonly _stepCounter: SolverStepCounter = new SolverStepCounter(this._statusList);

    protected constructor(protected readonly _solverOptions: SolverOptions,
                          protected readonly _displayManager: DisplayManager) {}

    protected abstract clear(): void;

    protected abstract startSolver(): void;

    protected abstract continueSolver(): void;

    start(): void {
        this._displayManager.display(PuzzleChange.INITIAL);
        this._statusList.clear();
        this._solverTimer.start();
        this._stepCounter.start();
        this.startSolver();
    }

    cancel(): void {
        this.clear();
        this._solverTimer.cancel();
    }

    continue(): void {
        this._solverTimer.continue();
        this.continueSolver();
    }

    protected stop(): void {
        this._solverTimer.stop();
    }

    protected addStatus(id: string, title: string, status: string): void {
        this._statusList.add(id, title, status);
    }

    protected stepCount(): void {
        this._stepCounter.increase();
    }

    protected overrideCounter(newCount: number): void {
        this._stepCounter.counter = newCount;
    }

}

class AnimatedFacade extends SolverFacade {

    // Track solver animation timeout.
    private _animationTimeoutId: number = 0;
    // The solver being used.
    private _solver: Solver = buildSolver(this._solverOptions);

    constructor(solverOptions: SolverOptions,
                displayManager: DisplayManager,
                private readonly _continue: HTMLElement,
                private readonly _animationDuration: number = 250) {
        super(solverOptions, displayManager);
    }

    protected clear(): void {
        if (this._animationTimeoutId) {
            clearInterval(this._animationTimeoutId);
            this._animationTimeoutId = 0;
        }
    }

    private solutionFound(puzzleChange: PuzzleChange): void {
        // Stop the timer and show the current result.
        this.clear();
        this.stop();
        let continueEvent;
        if (puzzleChange.isCompleted()) {
            this.addStatus("completed", "Puzzle Completed", "All solutions found!");
            continueEvent = new Event("disable");
        } else {
            this.addStatus("solved", "Solution Found", "A solution has been found but others may exist!");
            continueEvent = new Event("enable");
        }
        this._continue.dispatchEvent(continueEvent);
        this._displayManager.display(puzzleChange);
    }

    private runAnimatedSolver(): void {
        // Schedule a series of events to animate placing tiles on the puzzle.
        this._animationTimeoutId = setTimeout( () => {
            const puzzleChange = this._solver.nextState();
            if (puzzleChange.isSolved() || puzzleChange.isCompleted()) {
                this.solutionFound(puzzleChange);
            } else {
                this._displayManager.display(puzzleChange);
                this.stepCount()
                this.runAnimatedSolver();
            }
        }, this._animationDuration + 20);
    }

    protected startSolver(): void {
        // Show the initial tile positions.
        this._solver.initialState().forEach((tpChange) => this._displayManager.display(tpChange));
        // Kick off the animated solver.
        this.runAnimatedSolver();
    }

    protected continueSolver(): void {
        this.runAnimatedSolver();
    }

}

class WorkerFacade extends SolverFacade {

    // Track solver worker.
    private readonly _solverWorker: Worker = new Worker("solver-worker.ts");

    constructor(solverOptions: SolverOptions,
                displayManager: DisplayManager,
                private readonly _overlay: HTMLElement) {
        super(solverOptions, displayManager);
        // Attach a cancel trigger to the overlay.
        this._overlay.addEventListener("click", () => {
            this.cancel();
            this.disableOverlay();
        });
        // Attach an event to the worker to deal with the result.
        this._solverWorker.onmessage = (e) => {
            // Once complete, stop, show the returned result and then disable the overlay.
            this.stop();
            const result = <WorkerResult> e.data;
            this.overrideCounter(result.changeCounter);
            result.finalState.forEach((tpChange) => this._displayManager.display(tpChange));
            this.disableOverlay();
        }
    }

    protected clear(): void {
        if (this._solverWorker) {
            this._solverWorker.terminate();
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
            solverOptions: this._solverOptions
        }
        this._solverWorker.postMessage(parameters);
    }

    protected continueSolver() {
        // Set the overlay to prevent further UI interaction.
        this.enableOverlay();
        // Kick off the worker with an existing solver.
        const parameters: WorkerParameters = {
            newSolver: false,
            solverOptions: this._solverOptions
        }
        this._solverWorker.postMessage(parameters);
    }

}

export { SolverFacade, AnimatedFacade, WorkerFacade }
