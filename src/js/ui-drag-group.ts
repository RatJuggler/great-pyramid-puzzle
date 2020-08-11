import { isTilePositionId } from "./utils";


type Coords = {
    readonly x: number,
    readonly y: number
}

class UIDragGroup {

    private offset: Coords;
    private group: SVGGElement;
    private transform: SVGTransform;

    constructor(group: SVGGElement, mousePosition: Coords) {
        this.group = group;
        this.transform = group!.transform.baseVal.getItem(0);
        this.offset = {
            x: mousePosition.x - this.transform.matrix.e,
            y: mousePosition.y - this.transform.matrix.f
        }
    }

    drag(mousePosition: Coords): void {
        this.transform.setTranslate(mousePosition.x - this.offset.x, mousePosition.y - this.offset.y);
    }

    endDrag(document: Document, evt: MouseEvent): void {
        this.group.style.visibility = "hidden";
        const onElement = document.elementFromPoint(evt.clientX, evt.clientY);
        if (onElement) {
            const onGroup = onElement.parentElement;
            if (onGroup && isTilePositionId(onGroup.id)) {
                console.log("Tile " + this.group.id + " dropped on Position " + onGroup.id);
            }
        }
        this.group.style.visibility = "";
    }

}

export { UIDragGroup, Coords }
