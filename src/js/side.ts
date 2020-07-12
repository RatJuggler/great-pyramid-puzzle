// This is over-complicated for just working with sides.
// Would be simplified if we just used 0/1/2 for all faces instead of A/B/C (see Tile).


class Side {

    constructor(private _side: string, private _nSide: number) {}

    get name(): string {
        return this._side;
    }

    get value(): number {
        return this._nSide;
    }

}

class Sides {

    private static readonly SIDE_NAMES = ['A', 'B', 'C'];

    public readonly sideA = new Side(Sides.SIDE_NAMES[0], 0);
    public readonly sideB = new Side(Sides.SIDE_NAMES[1], 1);
    public readonly sideC = new Side(Sides.SIDE_NAMES[2], 2);

    private readonly _sides = new Map<string, Side>();

    constructor() {
        this._sides.set(this.sideA.name, this.sideA);
        this._sides.set(this.sideB.name, this.sideB);
        this._sides.set(this.sideC.name, this.sideC);
    }

    get numberOfSides(): number {
        return this._sides.size;
    }

    getSide(side: string, name: string): Side {
        if (Sides.SIDE_NAMES.includes(side)) {
            return this._sides.get(side)!;
        }
        throw new Error(`Side ${name} must be one of ${Sides.SIDE_NAMES}!`);
    }

}

const SIDES = new Sides();

export { SIDES, Side }
