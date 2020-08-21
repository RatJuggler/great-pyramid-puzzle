interface StatusUpdates {
    add: (id: string, title: string, status: string) => void;
    addTo: (id: string, status: string) => void;
    replace: (id: string, status: string) => void;
    clear: () => void;
}


class StatusUpdatesManager implements StatusUpdates {

    private readonly _statusUpdatesList: HTMLElement;

    constructor(private readonly _document: Document, statusUpdatesListId: string | HTMLElement) {
        if (typeof(statusUpdatesListId) === "string") {
            this._statusUpdatesList = this._document.getElementById(statusUpdatesListId)!;
        } else {
            this._statusUpdatesList = statusUpdatesListId;
        }
    }

    add(id: string, title: string, status: string): void {
        const newLi = this._document.createElement("li");
        newLi.id = id;
        const newH2 = this._document.createElement("h4");
        newH2.innerText = title;
        newLi.appendChild(newH2);
        const newP = this._document.createElement("p");
        newP.innerText = status;
        newLi.appendChild(newP);
        this._statusUpdatesList.appendChild(newLi);
    }

    private findStatusP(id: string): HTMLParagraphElement {
        const li = this._document.getElementById(id);
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
        this.findStatusP(id).innerText += status;
    }

    replace(id: string, status: string): void {
        this.findStatusP(id).innerText = status;
    }

    clear(): void {
        this._statusUpdatesList.innerHTML = "";
    }

}

export { StatusUpdates, StatusUpdatesManager }
