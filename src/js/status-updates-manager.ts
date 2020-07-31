interface StatusUpdates {
    add: (id: string, title: string, status: string) => void;
    addTo: (id: string, status: string) => void;
    replace: (id: string, status: string) => void;
    clear: () => void;
}


class StatusUpdatesManager implements StatusUpdates {

    private _statusUpdatesList: HTMLElement;

    constructor(eventListId: string) {
        this._statusUpdatesList = document.getElementById(eventListId)!;
    }

    add(id: string, title: string, status: string): void {
        const newLi = document.createElement("li");
        newLi.id = id;
        const newH2 = document.createElement("h4");
        newH2.innerText = title;
        newLi.appendChild(newH2);
        const newP = document.createElement("p");
        newP.innerText = status;
        newLi.appendChild(newP);
        this._statusUpdatesList.appendChild(newLi);
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

    addTo(id: string, status: string): void {
        StatusUpdatesManager.findStatusP(id).innerText += status;
    }

    replace(id: string, status: string): void {
        StatusUpdatesManager.findStatusP(id).innerText = status;
    }

    clear(): void {
        this._statusUpdatesList.innerHTML = "";
    }

}

export { StatusUpdates, StatusUpdatesManager }
