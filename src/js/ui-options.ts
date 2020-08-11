import { SolverOptions } from "./solver/solver-factory";


interface UIOptions {
    solutionOption: string;
    solverOptions: SolverOptions;
    animationSpeed: number;
}

class DOMUIOptions implements UIOptions {

    constructor(private readonly _document: Document) {}

    private getSelector(name: string): string {
        const selection  = this._document.querySelectorAll(`input[name = "${name}"]`) as NodeListOf<HTMLInputElement>;
        for (const rb of selection) {
            if (rb.checked) {
                return rb.value;
            }
        }
        throw new Error("Expected radio option to be selected!");
    }

    get solutionOption(): string {
        return this.getSelector("solution-option");
    }

    get solverOptions(): SolverOptions {
        return {
            puzzleType: this.getSelector("puzzle-type"),
            solveAlgorithm: this.getSelector("solve-algorithm"),
            tileSelection: this.getSelector("tile-selection"),
            tilePlacement: this.getSelector("tile-placement"),
            tileRotation: this.getSelector("tile-rotation"),
        };
    }

    get animationSpeed(): number {
        return parseInt(this.getSelector("animation-speed"));
    }

}

export { UIOptions, DOMUIOptions }
