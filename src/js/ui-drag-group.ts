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

    drag(mousePosition: Coords) {
        this.transform.setTranslate(mousePosition.x - this.offset.x, mousePosition.y - this.offset.y);
    }

    hide(): void {
        this.group.style.visibility = "hidden";
    }

    show(): void {
        this.group.style.visibility = "";
    }

}

export { UIDragGroup, Coords }
