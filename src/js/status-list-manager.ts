interface StatusList {
    addStatus: (id: string, title: string, status: string) => void;
    addToStatus: (id: string, status: string) => void;
    replaceStatus: (id: string, status: string) => void;
    clearList: () => void;
}


class StatusListManager implements StatusList {

    private _statusList: HTMLElement;

    constructor(eventListId: string) {
        this._statusList = document.getElementById(eventListId)!;
    }

    addStatus(id: string, title: string, status: string): void {
        const newLi = document.createElement("li");
        newLi.id = id;
        const newH2 = document.createElement("h4");
        newH2.innerText = title;
        newLi.appendChild(newH2);
        const newP = document.createElement("p");
        newP.innerText = status;
        newLi.appendChild(newP);
        this._statusList.appendChild(newLi);
    }

    private static findStatusP(id: string): HTMLParagraphElement {
        const li = document.getElementById(id);
        if (!li) {
            throw new Error("Unable to find status li!");
        }
        const liChildren = li.getElementsByTagName("p");
        if (liChildren.length === 0) {
            throw new Error("Unable to find status p!");
        }
        return liChildren.item(0)!;
    }

    addToStatus(id: string, status: string): void {
        StatusListManager.findStatusP(id).innerText += status;
    }

    replaceStatus(id: string, status: string): void {
        StatusListManager.findStatusP(id).innerText = status;
    }

    clearList(): void {
        this._statusList.innerHTML = "";
    }

}

export { StatusList, StatusListManager }
