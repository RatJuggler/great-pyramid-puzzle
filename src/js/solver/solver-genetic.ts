import { SolverBase } from "./solver-base";
import { PuzzleChange } from "../puzzle-changes";
import { Tetrahedron } from "../puzzle/tetrahedron";
import { Side } from "../puzzle/side";
import { getPuzzleComponents } from "../puzzle-loader";
import { getRandomInt } from "../utils";


class Population {

    private _population: Array<Tetrahedron>;
    private readonly _selection: Array<number>;

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
        this._memberWithMostSidesMatching = 0;
        this._totalMatchingAcrossAllMembers = 0;
        this._selection = new Array<number>(size);
        this.evaluation();
    }

    evaluation(): boolean {
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
        return this.bestSoFar().isSolved();
    }

    private selection(): Tetrahedron {
        let selected = -1;
        let r = Math.random();
        while (r > 0) {
            r -= this._selection[++selected];
        }
        return this._population[selected];
    }

    generation(): void {
        const newPopulation = new Array<Tetrahedron>(this._population.length);
        for (let i = 0; i < this._population.length; i++) {
            newPopulation[i] = this.selection();
        }
        this._population = newPopulation;
    }

    private static mutate(tetrahedron: Tetrahedron): void {
        const tilePositions = tetrahedron.tilePositions;
        if (Math.random() > 0.5) {
            tilePositions[getRandomInt(tilePositions.length)].state.rotate();
        } else {
            const swapFrom = getRandomInt(tilePositions.length);
            const swapTo = getRandomInt(tilePositions.length);
            if (swapFrom != swapTo) {
                const swapState = tilePositions[swapFrom].state;
                tilePositions[swapFrom].state = tilePositions[swapTo].state;
                tilePositions[swapTo].state = swapState;
            }
        }
    }

    mutation(): void {
        for (let i = 0; i < this._population.length; i++) {
            if (Math.random() > 0.01) {
                Population.mutate(this._population[i]);
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
        this._population.generation();
        this._population.mutation();
        if (this._population.evaluation()) {
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
