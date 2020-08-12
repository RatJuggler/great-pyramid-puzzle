import { UIOptions} from "../ui-options";
import { UIDragGroup } from "../ui-drag-group";
import { buildSolver, SolverOptions } from "./solver-factory";
import { Solver } from "./solver-base";
import { HumanSolver } from "./solver-human";
import { SolverTimer } from "./solver-timer";
import { SolverStepCounter } from "./solver-step-counter";
import { WorkerParameters, WorkerResult } from "../common-data-schema";
import { PuzzleChange, PuzzleChangeSet } from "../puzzle-changes";
import { DisplayManager } from "../display/display-manager";
import { StatusUpdates } from "../status-updates-manager";


abstract class SolverFacade {

    // Track how long solvers run for.
    private readonly _solverTimer: SolverTimer = new SolverTimer(this._statusUpdates);
    // Track how many steps they take.
    private readonly _stepCounter: SolverStepCounter = new SolverStepCounter(this._statusUpdates);

    protected constructor(protected readonly _solverOptions: SolverOptions,
                          protected readonly _displayManager: DisplayManager,
                          protected readonly _statusUpdates: StatusUpdates,
                          protected readonly _continueElement: HTMLElement) {}

    protected abstract solverCancel(): void;

    protected abstract startSolver(): void;

    protected abstract continueSolver(): void;

    start(): void {
        this._displayManager.display(PuzzleChange.INITIAL);
        this._statusUpdates.clear();
        this._solverTimer.start();
        this._stepCounter.start();
        this.startSolver();
    }

    cancel(): void {
        this.solverCancel();
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
        this._statusUpdates.add(id, title, status);
    }

    protected stepCount(): void {
        this._stepCounter.increase();
    }

    protected overrideCounter(newCount: number): void {
        this._stepCounter.counter = newCount;
    }

    protected solutionFound(puzzleChange: PuzzleChange): void {
        // Stop the timer and show the current result.
        this.stop();
        let continueEvent;
        if (puzzleChange.isCompleted()) {
            this.addStatus("completed", "Puzzle Completed", "All solutions found!");
            continueEvent = new Event("disable");
        } else {
            this.addStatus("solved", "Solution Found",
                `After ${this._stepCounter.counterForDisplay} steps, others may exist!`);
            continueEvent = new Event("enable");
        }
        this._continueElement.dispatchEvent(continueEvent);
        this._displayManager.display(puzzleChange);
    }

}


class AnimatedFacade extends SolverFacade {

    // Track solver animation timeout.
    private _animationTimeoutId: number = 0;
    // The solver being used.
    private _solver: Solver = buildSolver(this._solverOptions);

    constructor(solverOptions: SolverOptions,
                displayManager: DisplayManager,
                statusUpdates: StatusUpdates,
                continueElement: HTMLElement,
                private readonly _animationDuration: number = 250) {
        super(solverOptions, displayManager, statusUpdates, continueElement);
    }

    protected solverCancel(): void {
        if (this._animationTimeoutId) {
            clearInterval(this._animationTimeoutId);
            this._animationTimeoutId = 0;
        }
    }

    private processResult(puzzleChange: PuzzleChange): void {
        if (puzzleChange.isSolved() || puzzleChange.isCompleted()) {
            this.solverCancel();
            this.solutionFound(puzzleChange);
        } else {
            this.stepCount();
            this._displayManager.display(puzzleChange);
            this.runAnimatedSolver();
        }
    }

    private runAnimatedSolver(): void {
        // Schedule a series of events to animate placing tiles on the puzzle.
        this._animationTimeoutId = setTimeout( () => {
            this.processResult(this._solver.nextState());
        }, this._animationDuration + 20);
    }

    protected startSolver(): void {
        // Show the initial tile positions.
        this._displayManager.display(this._solver.initialState());
        // Kick off the animated solver.
        this.runAnimatedSolver();
    }

    protected continueSolver(): void {
        this.processResult(this._solver.forceNextState());
    }

}


class WorkerFacade extends SolverFacade {

    // Track solver worker.
    private readonly _solverWorker: Worker = new Worker("solver-worker-run.ts");

    constructor(solverOptions: SolverOptions,
                displayManager: DisplayManager,
                statusUpdates: StatusUpdates,
                continueElement: HTMLElement,
                private readonly _overlay: HTMLElement) {
        super(solverOptions, displayManager, statusUpdates, continueElement);
        // Attach a cancel trigger to the overlay.
        this._overlay.addEventListener("click", () => {
            this.cancel();
            const continueEvent = new Event("disable");
            this._continueElement.dispatchEvent(continueEvent);
            this.disableOverlay();
        });
        // Attach an event to the worker to deal with the result.
        this._solverWorker.onmessage = (e) => {
            this.processResult(<WorkerResult> e.data);
        }
    }

    protected solverCancel(): void {
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

    private processResult(workerResult: WorkerResult): void {
        const puzzleChange = PuzzleChangeSet.build(workerResult.solvedOrCompleted, workerResult.finalState);
        this.overrideCounter(workerResult.stepCounter);
        this.solutionFound(puzzleChange);
        this.disableOverlay();
    }

    protected startSolver(): void {
        // Set the overlay to prevent further UI interaction.
        this.enableOverlay();
        // Kick off the worker with a new solver.
        const parameters: WorkerParameters = {
            continue: false,
            solverOptions: this._solverOptions
        }
        this._solverWorker.postMessage(parameters);
    }

    protected continueSolver() {
        // Set the overlay to prevent further UI interaction.
        this.enableOverlay();
        // Kick off the worker with the current solver.
        const parameters: WorkerParameters = {
            continue: true,
            solverOptions: this._solverOptions
        }
        this._solverWorker.postMessage(parameters);
    }

}


class HumanFacade extends SolverFacade {

    // The solver being used.
    private _solver: Solver = buildSolver(this._solverOptions);

    constructor(solverOptions: SolverOptions,
                displayManager: DisplayManager,
                statusUpdates: StatusUpdates,
                continueElement: HTMLElement) {
        super(solverOptions, displayManager, statusUpdates, continueElement);
    }

    protected solverCancel(): void {}

    protected startSolver(): void {
        // Show the initial tile positions.
        this._displayManager.display(this._solver.initialState());
    }

    protected continueSolver(): void {}

    placeTile(dragGroup: UIDragGroup): void {
        this.stepCount();
        const puzzleChange = (<HumanSolver> this._solver).placeTile(dragGroup.id, dragGroup.toId);
        this._displayManager.display(puzzleChange);
        dragGroup.remove();
    }

    returnTile(dragGroup: UIDragGroup): void {
        const puzzleChange = (<HumanSolver> this._solver).returnTile(dragGroup.id);
        this._displayManager.display(puzzleChange);
        dragGroup.remove();
    }

}


function getSolverFacade(uiControls: UIOptions,
                         displayManager: DisplayManager,
                         statusUpdates: StatusUpdates,
                         continueButton: HTMLElement,
                         overlay: HTMLElement): SolverFacade {
    switch (uiControls.solutionOption) {
        case "Animated":
            // Animated solution needs to know the animation speed.
            return new AnimatedFacade(uiControls.solverOptions, displayManager, statusUpdates, continueButton, uiControls.animationSpeed);
        case "Completed":
            // Worker solution needs to know where the overlay element is.
            return new WorkerFacade(uiControls.solverOptions, displayManager, statusUpdates, continueButton, overlay!);
        case "Human":
            // Human solution needs to use it's own solver.
            const solverOptions = uiControls.solverOptions;
            solverOptions.solveAlgorithm = "Human";
            return new HumanFacade(solverOptions, displayManager, statusUpdates, continueButton);
        default:
            throw new Error("Invalid solution option!");
    }
}


export { SolverFacade, AnimatedFacade, WorkerFacade, HumanFacade, getSolverFacade }
