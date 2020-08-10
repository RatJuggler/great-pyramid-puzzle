import { SolverBase } from "./solver-base";
import { PuzzleChange } from "../puzzle-changes";
import { Tetrahedron } from "../puzzle/tetrahedron";
import { Side } from "../puzzle/side";
import { getPuzzleComponents } from "../puzzle-loader";
import { getRandomInt } from "../utils";


class Population {

    private _population: Array<Tetrahedron>;
    private readonly _selection: Array<number>;
    private readonly _sidesMatchingWhenSolved: number;

    private _memberWithMostSidesMatching: number;
    private _totalMatchingAcrossAllMembers: number;

    constructor(size: number, puzzleType: string) {
        this._population = new Array<Tetrahedron>(size);
        for (let i = 0; i < this._population.length; i++) {
            const puzzle = getPuzzleComponents(puzzleType);
            puzzle.tetrahedron.emptyTilePositions.forEach((tilePosition) => {
                tilePosition.state.tile = puzzle.tilePool.randomTile;
                tilePosition.state.rotations = getRandomInt(Side.numberOfSides);
            });
            this._population[i] = puzzle.tetrahedron;
        }
        this._sidesMatchingWhenSolved = this._population[0].tilePositionCount * Side.numberOfSides;
        this._memberWithMostSidesMatching = 0;
        this._totalMatchingAcrossAllMembers = 0;
        this._selection = new Array<number>(size);
        this.evaluate();
    }

    evaluate(): boolean {
        this._totalMatchingAcrossAllMembers = 0;
        this._memberWithMostSidesMatching = 0;
        for (let i = 0; i < this._population.length; i++) {
            const sidesMatching = this._population[i].countTileSidesMatching();
            if (sidesMatching > this._memberWithMostSidesMatching) {
                this._memberWithMostSidesMatching = i;
            }
            this._totalMatchingAcrossAllMembers += sidesMatching;
        }
        for (let i = 0; i < this._population.length; i++) {
            this._selection[i] = this._population[i].tileSidesMatching / this._totalMatchingAcrossAllMembers;
        }
        return this._memberWithMostSidesMatching === this._sidesMatchingWhenSolved;
    }

    getSelection(): Tetrahedron {
        let selected = -1;
        let r = Math.random();
        while (r > 0) {
            r -= this._selection[++selected];
        }
        return this._population[selected];
    }

    generate(): void {
        const newPopulation = new Array<Tetrahedron>(this._population.length);
        for (let i = 0; i < this._population.length; i++) {
            newPopulation[i] = this.getSelection();
        }
        this._population = newPopulation;
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

    private static readonly POPULATION_SIZE = 10;

    private readonly _population: Population;

    constructor(puzzleType: string) {
        super();
        this._population = new Population(GeneticSolver.POPULATION_SIZE, puzzleType);
    }

    initialState(): PuzzleChange {
        return GeneticSolver.current(this.stateForDisplay());
    }

    forceNextState(): PuzzleChange {
        return this.nextState();
    }

    nextState(): PuzzleChange {
        this._population.generate();
        this._population.mutate();
        if (this._population.evaluate()) {
            return GeneticSolver.solved(this.stateForDisplay());
        }
        return GeneticSolver.current(this.stateForDisplay());
    }

    stateForDisplay(): Array<PuzzleChange> {
        return this._population.bestSoFar().tilePositions
            .map((tilePosition) => {
                if (tilePosition.state.isEmpty()) {
                    throw new Error("Not expecting an empty tile position!");
                } else {
                    return SolverBase.set(tilePosition);
                }
            });
    }

}
