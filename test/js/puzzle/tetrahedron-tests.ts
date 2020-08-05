import valid_layout_config1 from "../data/valid-test-layout-data1.json";
import invalid_layout_config1 from "../data/invalid-layout-data1.json";
import invalid_layout_config2 from "../data/invalid-layout-data2.json";
import { buildTetrahedron } from "../../../src/js/puzzle-loader";
import { Face } from "../../../src/js/puzzle/face";
import { Tetrahedron } from '../../../src/js/puzzle/tetrahedron';
import { expect } from 'chai';
import 'mocha';


describe("Tetrahedron behaviour", function () {

    const validLayoutData = valid_layout_config1.testLayoutData;

    describe("if a new Tetrahedron is created", function () {

        context("with valid layout configuration file 1", function () {
            const tetrahedron = buildTetrahedron(validLayoutData);
            it("should return a correctly initialised instance", function () {
                expect(tetrahedron).to.be.an.instanceOf(Tetrahedron);
            });
            it("should have set the puzzle instance name", function () {
                expect(tetrahedron.name).to.equal("test-valid");
            });
            it("should have the correct number of Tile Positions on it", function () {
                expect(tetrahedron.tilePositionCount).to.equal(validLayoutData.numberOfTilesPerFace * 4);
            });
            it("should pass the integrity check", function () {
                expect(tetrahedron.integrityCheck()).to.eql([true, "Passed"]);
            });
            it("should return the correct toString result", function () {
                const expectedToString = "Puzzle Type: test-valid\n" +
                    "Face: 1, Tile Positions: 1, Joins: (1-A->3-B)(1-B->4-B)(1-C->2-B)\n" +
                    "TilePosition: 1, On Face: 1, Contains Tile: [Empty], Joins: (1-A->3-1-B)(1-B->4-1-B)(1-C->2-1-B)\n" +
                    "Face: 2, Tile Positions: 1, Joins: (2-A->3-C)(2-B->1-C)(2-C->4-A)\n" +
                    "TilePosition: 1, On Face: 2, Contains Tile: [Empty], Joins: (1-A->3-1-C)(1-B->1-1-C)(1-C->4-1-A)\n" +
                    "Face: 3, Tile Positions: 1, Joins: (3-A->4-C)(3-B->1-A)(3-C->2-A)\n" +
                    "TilePosition: 1, On Face: 3, Contains Tile: [Empty], Joins: (1-A->4-1-C)(1-B->1-1-A)(1-C->2-1-A)\n" +
                    "Face: 4, Tile Positions: 1, Joins: (4-A->2-C)(4-B->1-B)(4-C->3-A)\n" +
                    "TilePosition: 1, On Face: 4, Contains Tile: [Empty], Joins: (1-A->2-1-C)(1-B->1-1-B)(1-C->3-1-A)\n";
                expect(tetrahedron.toString()).to.equal(expectedToString);
            });
        });

        context("with invalid layout configuration file 1", function () {
            it("should throw an error", function () {
                const puzzleData = invalid_layout_config1.testLayoutData;
                expect(function () {
                    buildTetrahedron(puzzleData);
                }).to.throw(Error, "Tetrahedron must always have configuration data for 4 Faces!");
            });
        });

        context("with invalid layout configuration file 2", function () {
            const puzzleData = invalid_layout_config2.testLayoutData;
            const tetrahedron = buildTetrahedron(puzzleData);
            it("should fail the integrity check", function () {
                const expectedFailure = [false,
                    "Face joins not complete: Face: 1, Tile Positions: 1, Joins: \n" +
                    "TilePosition: 1, On Face: 1, Contains Tile: [Empty], Joins: \n"];
                expect(tetrahedron.integrityCheck()).to.eql(expectedFailure)
            });
        });

    });

    describe("if #getFace() is called with the name of a Face on the Tetrahedron", function () {

        context("when there is a Face with the given name already on the Tetrahedron", function () {
            it("should return the Face details", function () {
                const tetrahedron = buildTetrahedron(validLayoutData);
                const face = tetrahedron.getFace("3");
                expect(face).to.be.an.instanceOf(Face);
                const expectedToString =
                    "Face: 3, Tile Positions: 1, Joins: (3-A->4-C)(3-B->1-A)(3-C->2-A)\n" +
                    "TilePosition: 1, On Face: 3, Contains Tile: [Empty], Joins: (1-A->4-1-C)(1-B->1-1-A)(1-C->2-1-A)\n";
                expect(face.toString()).to.equal(expectedToString);
            });
        });

        context("when there isn't a Face with the given name on the Tetrahedron", function () {
            it("should throw an error", function () {
                const tetrahedron = buildTetrahedron(validLayoutData);
                expect(function () {
                    tetrahedron.getFace("A");
                }).to.throw(Error, "Face (A) not found on Tetrahedron!");
            });
        });

    });

});
