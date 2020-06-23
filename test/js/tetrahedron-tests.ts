import * as valid_config1 from "../valid-test-puzzle-data1.json";
import * as invalid_config1 from "../invalid-test-puzzle-data1.json";
import { Tetrahedron } from '../../src/js/tetrahedron';
import { expect } from 'chai';
import 'mocha';


describe("Tetrahedron behaviour", () => {

    describe("if a new Tetrahedron is created", () => {

        context("with valid configuration data file 1", () => {
            it("should return a correctly initialised instance", () => {
                const puzzleData = valid_config1.testPuzzleData;
                const tetrahedron = new Tetrahedron(puzzleData.puzzle, puzzleData.numberOfTilesPerFace, puzzleData.faces);
                expect(tetrahedron).to.be.an.instanceOf(Tetrahedron);
                expect(tetrahedron.name).to.equal("test-valid");
            });
        });

        context("with invalid configuration data file 1", () => {
            it("should throw an error", () => {
                const puzzleData = invalid_config1.testPuzzleData;
                expect(() => {
                    new Tetrahedron(puzzleData.puzzle, puzzleData.numberOfTilesPerFace, puzzleData.faces);
                }).to.throw(Error, "Tetrahedron must always have configuration data for 4 Faces!");
            });
        });

    });

});
