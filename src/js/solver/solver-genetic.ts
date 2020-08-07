import { SolverBase } from "./solver-base";
import { PuzzleChange, PuzzleChangeSet } from "../puzzle-changes";
import { Tetrahedron } from "../puzzle/tetrahedron";
import { Side } from "../puzzle/side";
import { getPuzzleComponents } from "../puzzle-loader";
import { getRandomInt } from "../utils";


class Population {

    private readonly _population = new Array<Tetrahedron>();
    private readonly _sidesMatchingWhenSolved: number;

    private _memberWithMostSidesMatching = 0;

    constructor(size: number, puzzleType: string) {
        for (let i = 0; i < size; i++) {
            const puzzle = getPuzzleComponents(puzzleType);
            puzzle.tetrahedron.emptyTilePositions.forEach((tilePosition) => {
                tilePosition.state.tile = puzzle.tilePool.randomTile;
                tilePosition.state.rotations = getRandomInt(Side.numberOfSides);
            });
            this._population.push(puzzle.tetrahedron);
        }
        this._sidesMatchingWhenSolved = this._population[0].tilePositionCount * Side.numberOfSides;
    }

    evaluate(): boolean {
        this._memberWithMostSidesMatching = 0;
        for (let i = 0; i < this._population.length; i++) {
            const sidesMatching = this._population[i].tileSidesMatching();
            if (sidesMatching > this._memberWithMostSidesMatching) {
                this._memberWithMostSidesMatching = sidesMatching;
            }
        }
        return this._memberWithMostSidesMatching == this._sidesMatchingWhenSolved;
    }

    bestSoFar(): Tetrahedron {
        return this._population[this._memberWithMostSidesMatching];
    }

}


export class GeneticSolver extends SolverBase {

    private static readonly POPULATION_SIZE = 10;

    private readonly _population: Population;

    constructor(puzzleType: string) {
        super();
        this._population = new Population(GeneticSolver.POPULATION_SIZE, puzzleType);
    }

    initialState(): Array<PuzzleChange> {
        return this.currentState();
    }

    forceNextState(): PuzzleChange {
        return PuzzleChange.COMPLETED;
    }

    nextState(): PuzzleChange {
        this._population.evaluate();
        return PuzzleChangeSet.current(this.currentState());
    }

    currentState(): Array<PuzzleChange> {
        return this._population.bestSoFar().tilePositions.map((tilePosition) => {
            if (tilePosition.state.isEmpty()) {
                return SolverBase.empty(tilePosition);
            } else {
                return SolverBase.set(tilePosition);
            }
        });
    }

}
