export class Timer {

    private _startTime: number = 0;
    private _finishTime: number = 0;

    constructor() {}

    start(): void {
        this._startTime = Date.now();
        this._finishTime = 0;
    }

    stop(): void {
        this._finishTime = Date.now();
    }

    elapsed(): string {
        if (this._startTime && this._finishTime) {
            return Timer.format(this._finishTime - this._startTime);
        }
        throw new Error("Timer not initialised properly!");
    }

    private static format(elapsed: number): string {
        const seconds = Math.floor((elapsed / 1000) % 60);
        const minutes = Math.floor((elapsed / 1000 / 60) % 60);
        const hours = Math.floor(elapsed / (1000 * 60 * 60));
        return (hours < 10 ? "0" + hours : hours)
            + ":" + (minutes < 10 ? "0" + minutes : minutes)
            + ":" + (seconds < 10 ? "0" + seconds : seconds);
    }

}
