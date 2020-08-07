import { SolverBase } from "./solver-base";
import { PuzzleChange } from "../puzzle-changes";
import { Tetrahedron } from "../puzzle/tetrahedron";
import { getPuzzleComponents } from "../puzzle-loader";
import { getRandomInt } from "../utils";


class Population {

    private readonly _population = new Array<Tetrahedron>();

    constructor(size: number, puzzleType: string) {
        for (let i = 0; i < size; i++) {
            const puzzle = getPuzzleComponents(puzzleType);
            puzzle.tetrahedron.emptyTilePositions.forEach((tilePosition) => {
                tilePosition.state.tile = puzzle.tilePool.randomTile;
                tilePosition.state.rotations = getRandomInt(3);
            });
            this._population.push(puzzle.tetrahedron);
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

    constructor(puzzleType: string) {
        super();
        this._population = new Population(GeneticSolver.POPULATION_SIZE, puzzleType);
    }

    initialState(): Array<PuzzleChange> {
        return [PuzzleChange.INITIAL];
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

    currentState(): Array<PuzzleChange> {
        return [PuzzleChange.SOLVED];
    }

}
