import { isTilePositionId } from "./utils";


type Coords = {
    readonly x: number,
    readonly y: number
}

class UIDragGroup {

    private svg: SVGSVGElement;
    private group: SVGGElement;
    private offset: Coords;
    private transform: SVGTransform;

    private mapMousePosition(evt: MouseEvent): Coords {
        let CTM = this.svg.getScreenCTM()!;
        return {
            x: (evt.clientX - CTM.e) / CTM.a,
            y: (evt.clientY - CTM.f) / CTM.d
        };
    }

    constructor(svg: SVGSVGElement, group: SVGGElement, evt: MouseEvent) {
        this.svg = svg;
        this.group = group;
        let mousePosition = this.mapMousePosition(evt);
        this.transform = group!.transform.baseVal.getItem(0);
        this.offset = {
            x: mousePosition.x - this.transform.matrix.e,
            y: mousePosition.y - this.transform.matrix.f
        }
    }

    get id(): number {
        return parseInt(this.group.id.substring(4));
    }

    drag(evt: MouseEvent): void {
        const mousePosition = this.mapMousePosition(evt);
        this.transform.setTranslate(mousePosition.x - this.offset.x, mousePosition.y - this.offset.y);
    }

    endDrag(document: Document, evt: MouseEvent): HTMLElement | null {
        // Hide dragged element so we can see what's underneath it.
        this.group.style.visibility = "hidden";
        let returnGroup = null;
        const onElement = document.elementFromPoint(evt.clientX, evt.clientY);
        if (onElement) {
            let onGroup = onElement.parentElement;
            if (onGroup && isTilePositionId(onGroup.id)) {
                returnGroup = onGroup;
            }
        }
        this.group.style.visibility = "";
        return returnGroup;
    }

    tilePlaced(): void {
        this.group.remove();
    }

}

export { UIDragGroup }
