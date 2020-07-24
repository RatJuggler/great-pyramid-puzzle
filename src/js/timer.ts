import {EventList} from "./event-list-manager";


export class Timer {

    private _startTime: number = 0;
    private _finishTime: number = 0;

    constructor(private readonly _eventList: EventList) {}

    start(): void {
        this._eventList.clearEvents();
        const now = new Date();
        this._startTime = now.getTime();
        this._finishTime = 0;
        this._eventList.addEvent("Started: " + Timer.formatTime(now));
    }

    stop(): void {
        const now = new Date();
        this._finishTime = now.getTime();
        this._eventList.addEvent("Finished: " + Timer.formatTime(now));
        this._eventList.addEvent("Elapsed: " + this.elapsed());
    }

    private elapsed(): string {
        if (this._startTime && this._finishTime) {
            return Timer.formatElapse(this._finishTime - this._startTime);
        }
        throw new Error("Timer not initialised properly!");
    }

    private static format(hours: number, minutes: number, seconds: number) {
        return (hours < 10 ? "0" + hours : hours)
            + ":" + (minutes < 10 ? "0" + minutes : minutes)
            + ":" + (seconds < 10 ? "0" + seconds : seconds);
    }

    private static formatElapse(elapsed: number): string {
        const seconds = Math.floor((elapsed / 1000) % 60);
        const minutes = Math.floor((elapsed / 1000 / 60) % 60);
        const hours = Math.floor(elapsed / (1000 * 60 * 60));
        return Timer.format(hours, minutes, seconds);
    }

    private static formatTime(time: Date): string {
        const seconds = time.getSeconds();
        const minutes = time.getMinutes();
        const hours = time.getHours();
        return Timer.format(hours, minutes, seconds);
    }

}
