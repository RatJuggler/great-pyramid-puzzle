interface EventList {
    addEvent: (event: string) => void;
    clearEvents: () => void;
}


class EventListManager implements EventList {

    private _eventList: HTMLElement;

    constructor(eventListId: string) {
        this._eventList = document.getElementById(eventListId)!;
    }

    addEvent(event: string): void {
        const newLi = document.createElement("li");
        const newP = document.createElement("p");
        newP.innerText = event;
        newLi.appendChild(newP);
        this._eventList.appendChild(newLi);
    }

    clearEvents(): void {
        this._eventList.innerHTML = "";
    }

}

export { EventList, EventListManager }
