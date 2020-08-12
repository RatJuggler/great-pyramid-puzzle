import { isTilePositionId } from "./utils";


type Coords = {
    readonly x: number,
    readonly y: number
}

class UIDragGroup {

    private document: Document;
    private svg: SVGSVGElement;
    private dragGroup: SVGGElement;
    private fromGroup: Element;
    private toGroup: Element | null;
    private offset: Coords;
    private transform: SVGTransform;

    private mapMousePosition(evt: MouseEvent): Coords {
        let CTM = this.svg.getScreenCTM()!;
        return {
            x: (evt.clientX - CTM.e) / CTM.a,
            y: (evt.clientY - CTM.f) / CTM.d
        };
    }

    private onElement(evt: MouseEvent): Element | null {
        // Hide dragged element so we can see what's underneath it.
        this.dragGroup.style.visibility = "hidden";
        const onElement = this.document.elementFromPoint(evt.clientX, evt.clientY);
        this.dragGroup.style.visibility = "";
        return onElement;
    }

    constructor(document: Document, svg: SVGSVGElement, group: SVGGElement, evt: MouseEvent) {
        this.document = document;
        this.svg = svg;
        this.dragGroup = group;
        const fromGroup = this.onElement(evt);
        if (!fromGroup) {
            throw new Error("Must drag from an Element!");
        }
        this.fromGroup = fromGroup;
        this.toGroup = null;
        let mousePosition = this.mapMousePosition(evt);
        this.transform = group!.transform.baseVal.getItem(0);
        this.offset = {
            x: mousePosition.x - this.transform.matrix.e,
            y: mousePosition.y - this.transform.matrix.f
        }
    }

    get id(): number {
        return parseInt(this.dragGroup.id.substring(4));
    }

    get fromId(): string {
        if (this.fromGroup) {
            return this.fromGroup.id;
        }
        throw new Error("Dragged group was not dragged from an element!");
    }

    get toId(): string {
        if (this.toGroup) {
            return this.toGroup.id;
        }
        throw new Error("Dragged group has not been dropped on an element yet!");
    }

    drag(evt: MouseEvent): void {
        const mousePosition = this.mapMousePosition(evt);
        this.transform.setTranslate(mousePosition.x - this.offset.x, mousePosition.y - this.offset.y);
    }

    endDrag(evt: MouseEvent): Element | null {
        const onElement = this.onElement(evt);
        if (onElement) {
            let onGroup = onElement.parentElement;
            if (onGroup && isTilePositionId(onGroup.id)) {
                this.toGroup = onGroup;
                console.log("Tile: " + this.dragGroup.id + " - From: " + this.fromGroup.id + " - To: " + this.toGroup.id);
            }
        }
        return this.toGroup;
    }

    tilePlaced(): void {
        this.dragGroup.remove();
    }

}

export { UIDragGroup }
