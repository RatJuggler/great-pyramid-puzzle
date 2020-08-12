import { isStartId, isTileId, isTilePositionId } from "./utils";


type Coords = {
    readonly x: number,
    readonly y: number
}

class UIDragGroup {

    private dragGroup: SVGGElement | null = null;
    private fromGroup: Element | null = null;
    private toGroup: Element | null = null;
    private offset: Coords | null = null;
    private transform: SVGTransform | null = null;

    constructor(private readonly document: Document, private readonly svg: SVGSVGElement) {}

    private mapMousePosition(evt: MouseEvent): Coords {
        let CTM = this.svg.getScreenCTM()!;
        return {
            x: (evt.clientX - CTM.e) / CTM.a,
            y: (evt.clientY - CTM.f) / CTM.d
        };
    }

    private onParentGroup(evt: MouseEvent): Element | null {
        if (this.dragGroup) {
            // Hide dragged element so we can see what's underneath it.
            this.dragGroup.style.visibility = "hidden";
            const onElement = this.document.elementFromPoint(evt.clientX, evt.clientY);
            this.dragGroup.style.visibility = "";
            if (onElement) {
                const onParent = onElement.parentElement;
                if (onParent && (isStartId(onParent.id) || isTilePositionId(onParent.id))) {
                    return onParent;
                }
            }
        }
        return null;
    }

    validDrag(evt: MouseEvent): boolean {
        if (evt.target) {
            let node = (<Element> evt.target).parentNode;
            // Only Tile groups should be draggable.
            if (node && isTileId((<HTMLElement> node).id)) {
                this.dragGroup = <SVGGElement> node;
                const dragFrom = this.onParentGroup(evt);
                if (dragFrom) {
                    this.fromGroup = dragFrom;
                    let mousePosition = this.mapMousePosition(evt);
                    this.transform = this.dragGroup.transform.baseVal.getItem(0);
                    this.offset = {
                        x: mousePosition.x - this.transform.matrix.e,
                        y: mousePosition.y - this.transform.matrix.f
                    }
                    return true;
                }
            }
        }
        return false;
    }

    get id(): number {
        if (this.dragGroup) {
            return parseInt(this.dragGroup.id.substring(4));
        }
        throw new Error("Dragged group not found!");
    }

    get fromId(): string {
        if (this.fromGroup) {
            return this.fromGroup.id;
        }
        throw new Error("Dragged group was not dragged from an element!");
    }

    isFromStart(): boolean {
        return isStartId(this.fromId);
    }

    isFromTilePosition(): boolean {
        return isTilePositionId(this.fromId);
    }

    hasTo(): boolean {
        return !!this.toGroup;
    }

    get toId(): string {
        if (this.toGroup) {
            return this.toGroup.id;
        }
        throw new Error("Dragged group has not been dropped on an element yet!");
    }

    isToStart(): boolean {
        return isStartId(this.toId);
    }

    isToTilePosition(): boolean {
        return isTilePositionId(this.toId);
    }

    drag(evt: MouseEvent): void {
        if (this.transform && this.offset) {
            const mousePosition = this.mapMousePosition(evt);
            this.transform.setTranslate(mousePosition.x - this.offset.x, mousePosition.y - this.offset.y);
        }
    }

    endDrag(evt: MouseEvent): boolean {
        this.toGroup = this.onParentGroup(evt);
        if (this.dragGroup && this.fromGroup && this.toGroup) {
            console.log("Tile: " + this.dragGroup.id + " - From: " + this.fromGroup.id + " - To: " + this.toGroup.id);
            return true;
        }
        return false;
    }

    remove(): void {
        if (this.dragGroup) {
            this.dragGroup.remove();
        }
    }

}

export { UIDragGroup }
