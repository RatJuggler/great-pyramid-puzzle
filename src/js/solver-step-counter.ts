import {StatusUpdates} from "./status-updates-manager";


export class SolverStepCounter {

    private static readonly STATUS_ID = "solver-step-counter";

    private _counter: number = 0;

    constructor(private readonly _statusUpdates: StatusUpdates) {}

    private static format(number: number) {
        return new Intl.NumberFormat().format(number);
    }

    private updateDisplay(): void {
        this._statusUpdates.replace(SolverStepCounter.STATUS_ID, SolverStepCounter.format(this._counter));
    }

    start(): void {
        this._counter = 0;
        this._statusUpdates.add(SolverStepCounter.STATUS_ID, "Step Counter", "0");
    }

    get counterForDisplay(): string {
        return SolverStepCounter.format(this._counter);
    }

    set counter(counter: number) {
        this._counter = counter;
        this.updateDisplay();
    }

    increase(): void {
        this._counter++;
        this.updateDisplay();
    }

}
