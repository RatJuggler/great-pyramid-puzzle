import { StatusList } from "./status-list-manager";


export class SolverTimer {

    private static readonly STATUS_ID = "solver-timer";

    private _startTime: Date | null = null;
    private _finishTime: Date | null = null;
    private _elapsedIntervalId: number = 0;

    constructor(private readonly _statusList: StatusList) {}

    private updateDisplay() {
        const update = "Started: " + SolverTimer.formatTime(this._startTime) + "\nElapsed: " + this.elapsed(new Date());
        this._statusList.replace(SolverTimer.STATUS_ID, update);
    }

    start(): void {
        // Clear any previous timers.
        if (this._elapsedIntervalId) {
            clearInterval(this._elapsedIntervalId);
        }
        this._startTime = new Date();
        this._finishTime = null;
        this._elapsedIntervalId = setInterval(() => {
            this.updateDisplay();
        }, 1000);
        this._statusList.add(SolverTimer.STATUS_ID, "Timer", "Starting...");
    }

    stop(): void {
        clearInterval(this._elapsedIntervalId);
        this._finishTime = new Date();
        const update = "Started: " + SolverTimer.formatTime(this._startTime) +
            "\nFinished: " + SolverTimer.formatTime(this._finishTime) +
            "\nElapsed: " + this.elapsed(this._finishTime);
        this._statusList.replace(SolverTimer.STATUS_ID, update);
    }

    cancel(): void {
        clearInterval(this._elapsedIntervalId);
        this._statusList.addTo(SolverTimer.STATUS_ID, "\nCancelled!");
    }

    private elapsed(since: Date): string {
        if (!this._startTime) {
            throw new Error("SolverTimer not initialised properly!")
        }
        return SolverTimer.formatElapse(since.getTime() - this._startTime.getTime());
    }

    private static format(hours: number, minutes: number, seconds: number) {
        return (hours < 10 ? "0" + hours : hours)
            + ":" + (minutes < 10 ? "0" + minutes : minutes)
            + ":" + (seconds < 10 ? "0" + seconds : seconds);
    }

    private static formatElapse(elapsed: number): string {
        const totalSeconds = elapsed / 1000;
        const seconds = Math.round(totalSeconds % 60);
        const minutes = Math.floor((totalSeconds / 60) % 60);
        const hours = Math.floor(totalSeconds / (60 * 60));
        return SolverTimer.format(hours, minutes, seconds);
    }

    private static formatTime(time: Date | null): string {
        if (!time) {
            throw new Error("SolverTimer not initialised properly!")
        }
        const seconds = time.getSeconds();
        const minutes = time.getMinutes();
        const hours = time.getHours();
        return SolverTimer.format(hours, minutes, seconds);
    }

}
