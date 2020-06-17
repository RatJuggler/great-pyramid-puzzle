import { Face } from '../../src/js/face';
import { expect } from 'chai';
import 'mocha';

describe("Face tests", () => {

    it("checking constructor", () => {
        const id = "A";
        const face = new Face(id);
        expect(face.id).to.equal(id);
    });

});
