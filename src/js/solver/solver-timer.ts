import { StatusUpdates } from "../status-updates-manager";


export class SolverTimer {

    private static readonly STATUS_ID = "solver-timer";

    private _startTime: Date | null = null;
    private _finishTime: Date | null = null;
    private _totalElapsed: number = 0;
    private _elapsedIntervalId: number = 0;

    constructor(private readonly _statusUpdates: StatusUpdates) {}

    private updateDisplay(): void {
        const elapsed = this.elapsed(new Date());
        const update =
              "Started: " + SolverTimer.formatTime(this._startTime) +
            "\nElapsed: " + SolverTimer.formatElapsed(elapsed) +
            "\nTotal  : " + SolverTimer.formatElapsed(this._totalElapsed + elapsed);
        this._statusUpdates.replace(SolverTimer.STATUS_ID, update);
    }

    private clearInterval(): void {
        clearInterval(this._elapsedIntervalId);
        this._elapsedIntervalId = 0;
    }

    start(): void {
        this.clearInterval();
        this.continue();
        this._statusUpdates.add(SolverTimer.STATUS_ID, "Timer", "Starting...");
    }

    stop(): void {
        if (!this._elapsedIntervalId) {
            throw new Error("Timer already stopped!");
        }
        this.clearInterval();
        this._finishTime = new Date();
        const elapsed = this.elapsed(this._finishTime);
        this._totalElapsed += elapsed;
        const update =
              "Started : " + SolverTimer.formatTime(this._startTime) +
            "\nFinished: " + SolverTimer.formatTime(this._finishTime) +
            "\nElapsed : " + SolverTimer.formatElapsed(elapsed) +
            "\nTotal   : " + SolverTimer.formatElapsed(this._totalElapsed);
        this._statusUpdates.replace(SolverTimer.STATUS_ID, update);
    }

    continue(): void {
        this._startTime = new Date();
        this._finishTime = null;
        this._elapsedIntervalId = setInterval(() => {
            this.updateDisplay();
        }, 1000);
    }

    cancel(): void {
        if (!this._elapsedIntervalId) {
            throw new Error("Timer already cancelled!");
        }
        this.clearInterval();
        this._statusUpdates.addTo(SolverTimer.STATUS_ID, "\nCancelled!");
    }

    private elapsed(since: Date): number {
        if (!this._startTime) {
            throw new Error("SolverTimer not initialised properly!")
        }
        return since.getTime() - this._startTime.getTime();
    }

    private static format(hours: number, minutes: number, seconds: number) {
        return (hours < 10 ? "0" + hours : hours)
            + ":" + (minutes < 10 ? "0" + minutes : minutes)
            + ":" + (seconds < 10 ? "0" + seconds : seconds);
    }

    private static formatElapsed(elapsed: number): string {
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
