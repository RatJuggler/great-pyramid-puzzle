import {StatusList} from "./status-list-manager";


export class SolverStepCounter {

    private static readonly STATUS_ID = "steps-counter";

    private _counter: number = 0;

    constructor(private readonly _statusList: StatusList) {}

    private static format(number: number) {
        return new Intl.NumberFormat().format(number);
    }

    private updateDisplay(): void {
        this._statusList.replaceStatus(SolverStepCounter.STATUS_ID, SolverStepCounter.format(this._counter));
    }

    start(): void {
        this._counter = 0;
        this._statusList.addStatus(SolverStepCounter.STATUS_ID, "Step Counter", "0");
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