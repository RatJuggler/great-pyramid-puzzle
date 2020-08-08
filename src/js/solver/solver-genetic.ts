import { SolverBase } from "./solver-base";
import { PuzzleChange } from "../puzzle-changes";
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
                this._memberWithMostSidesMatching = i;
            }
        }
        return this._memberWithMostSidesMatching == this._sidesMatchingWhenSolved;
    }

    mutate(): void {
        for (let i = 0; i < this._population.length; i++) {
            const tilePositions = this._population[i].tilePositions;
            for (let j = 0; j < getRandomInt(tilePositions.length); j++) {
                const swapFrom = getRandomInt(tilePositions.length);
                const swapTo = getRandomInt(tilePositions.length);
                if (swapFrom != swapTo) {
                    const swapState = tilePositions[swapFrom].state;
                    tilePositions[swapFrom].state = tilePositions[swapTo].state;
                    tilePositions[swapTo].state = swapState;
                }
                if (getRandomInt(100) > 90) {
                    tilePositions[swapFrom].state.rotate();
                }
            }
        }
    }

    bestSoFar(): Tetrahedron {
        return this._population[this._memberWithMostSidesMatching];
    }

}


export class GeneticSolver extends SolverBase {

    private static readonly POPULATION_SIZE = 100;

    private readonly _population: Population;

    constructor(puzzleType: string) {
        super();
        this._population = new Population(GeneticSolver.POPULATION_SIZE, puzzleType);
    }

    initialState(): PuzzleChange {
        return this.currentState();
    }

    forceNextState(): PuzzleChange {
        return this.nextState();
    }

    nextState(): PuzzleChange {
        this._population.mutate();
        if (this._population.evaluate()) {
            return this.solved();
        }
        return this.currentState();
    }

    private stateForDisplay(): Array<PuzzleChange> {
        return this._population.bestSoFar().tilePositions
            .map((tilePosition) => {
                if (tilePosition.state.isEmpty()) {
                    throw new Error("Not expecting an empty tile position!");
                } else {
                    return SolverBase.set(tilePosition);
                }
            });
    }

    currentState(): PuzzleChange {
        return SolverBase.current(this.stateForDisplay());
    }

    solved(): PuzzleChange {
        return SolverBase.solved(this.stateForDisplay());
    }

}
