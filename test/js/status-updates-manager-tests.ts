import { StatusUpdates } from "../../src/js/status-updates-manager";


class MockStatusUpdates implements StatusUpdates {

    private _mockStatus: string = "";

    get mockStatus(): string {
        return this._mockStatus;
    }

    add(id: string, title: string, status: string): void {
        this._mockStatus = `Add: ${id} - ${title} - ${status}`;
    }

    addTo(id: string, status: string): void {
        this._mockStatus += `AddTo: ${id} - ${status}`;
    }

    clear(): void {
        throw new Error("Not expected to be called as part of these tests!");
    }

    replace(id: string, status: string): void {
        this._mockStatus = `Replace: ${id} - ${status}`;
    }

}

export { MockStatusUpdates }
