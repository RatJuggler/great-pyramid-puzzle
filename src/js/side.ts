enum Side {SideA = 'A', SideB = 'B', SideC = 'C'}

class Sides {

    private static readonly SIDE_NAMES = ['A', 'B', 'C'];

    public readonly sideA = Side.SideA;
    public readonly sideB = Side.SideB;
    public readonly sideC = Side.SideC;

    private readonly _sides = new Map<string, Side>();

    constructor() {
        this._sides.set(this.sideA, this.sideA);
        this._sides.set(this.sideB, this.sideB);
        this._sides.set(this.sideC, this.sideC);
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
