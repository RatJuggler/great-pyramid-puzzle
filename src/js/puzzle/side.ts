class Side {

    static readonly sideA = new Side("A");
    static readonly sideB = new Side("B");
    static readonly sideC = new Side("C");

    private readonly _side: string;

    constructor(side: string) {
        this._side = side;
    }

    static get numberOfSides(): number {
        return 3;
    }

    static validateSide(side: string): Side {
        switch (side) {
            case "A":
                return Side.sideA;
            case "B":
                return Side.sideB;
            case "C":
                return Side.sideC;
            default:
                throw new Error(`Side ${side} must be one of A, B or C!`);
        }
    }

    toString(): string {
        return this._side;
    }

}

export { Side }
