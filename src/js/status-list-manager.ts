interface StatusList {
    addStatus: (status: string) => void;
    clearStatus: () => void;
}


class StatusListManager implements StatusList {

    private _statusList: HTMLElement;

    constructor(eventListId: string) {
        this._statusList = document.getElementById(eventListId)!;
    }

    addStatus(status: string): void {
        const newLi = document.createElement("li");
        const newP = document.createElement("p");
        newP.innerText = status;
        newLi.appendChild(newP);
        this._statusList.appendChild(newLi);
    }

    clearStatus(): void {
        this._statusList.innerHTML = "";
    }

}

export { StatusList, StatusListManager }
