import { SolverBase } from "./solver-base";
import { PuzzleChange } from "../puzzle-changes";
import { Tetrahedron } from "../tetrahedron";
import { TilePool } from "../tile-pool";


class Population {

    private readonly _population = new Array<Tetrahedron>();

    constructor(size: number, tetrahedron: Tetrahedron) {
        for (let i = 0; i < size; i++) {
            this._population.push(tetrahedron);
        }
    }

    isSolved(): boolean {
        return true;
    }

    bestSoFar() {
        return PuzzleChange.SOLVED;
    }

}


export class GeneticSolver extends SolverBase {

    private static readonly POPULATION_SIZE = 100;

    private readonly _population: Population;

    constructor(tetrahedron: Tetrahedron, tilePool: TilePool) {
        super(tetrahedron, tilePool);
        this._population = new Population(GeneticSolver.POPULATION_SIZE, tetrahedron);
    }

    forceNextState(): PuzzleChange {
        return PuzzleChange.COMPLETED;
    }

    nextState(): PuzzleChange {
        if (this._population.isSolved()) {
            return PuzzleChange.SOLVED;
        } else {
            return this._population.bestSoFar();
        }
    }

}
