import { Tetrahedron } from '../../src/js/tetrahedron';
import { expect } from 'chai';
import 'mocha';

describe("Tetrahedron tests", () => {

    it("checking constructor", () => {
        const name = "Pocket";
        const puzzle = new Tetrahedron(name);
        expect(puzzle.name).to.equal(name);
    });

});
