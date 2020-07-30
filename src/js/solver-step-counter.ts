import {StatusList} from "./status-list-manager";


export class SolverStepCounter {

    private static readonly STATUS_ID = "solver-step-counter";

    private _counter: number = 0;

    constructor(private readonly _statusList: StatusList) {}

    private static format(number: number) {
        return new Intl.NumberFormat().format(number);
    }

    private updateDisplay(): void {
        this._statusList.replace(SolverStepCounter.STATUS_ID, SolverStepCounter.format(this._counter));
    }

    start(): void {
        this._counter = 0;
        this._statusList.add(SolverStepCounter.STATUS_ID, "Step Counter", "0");
    }

    get counter(): number {
        return this._counter;
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
