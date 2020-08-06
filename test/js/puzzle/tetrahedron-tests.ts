import { Face } from "../../../src/js/puzzle/face";
import { Tetrahedron } from '../../../src/js/puzzle/tetrahedron';
import { TilePosition } from "../../../src/js/puzzle/tile-position";
import { expect } from 'chai';
import 'mocha';
// @ts-ignore
import { TILE_1, TILE_2 } from "../common-test-data";


describe("Tetrahedron behaviour", function () {

    let tetrahedron: Tetrahedron;
    let face1WithOneTilePosition: Face;

    beforeEach(function () {
        const tilePosition1_1 = new TilePosition("1", "1");
        const tilePositions1 = new Map<string, TilePosition>();
        tilePositions1.set(tilePosition1_1.name, tilePosition1_1);
        face1WithOneTilePosition = new Face("1", tilePositions1);
        const tilePosition2_1 = new TilePosition("1", "2");
        const tilePositions2 = new Map<string, TilePosition>();
        tilePositions2.set(tilePosition2_1.name, tilePosition2_1);
        const face2WithOneTilePosition = new Face("2", tilePositions2);
        const tilePosition3_1 = new TilePosition("1", "3");
        const tilePositions3 = new Map<string, TilePosition>();
        tilePositions3.set(tilePosition3_1.name, tilePosition3_1);
        const face3WithOneTilePosition = new Face("3", tilePositions3);
        const tilePosition4_1 = new TilePosition("1", "4");
        const tilePositions4 = new Map<string, TilePosition>();
        tilePositions4.set(tilePosition2_1.name, tilePosition4_1);
        const face4WithOneTilePosition = new Face("4", tilePositions4);
        const faces: Array<Face> = [
            face1WithOneTilePosition,
            face2WithOneTilePosition,
            face3WithOneTilePosition,
            face4WithOneTilePosition
        ];
        tetrahedron = new Tetrahedron("test", faces);
    });

    describe("if a new Tetrahedron is created", function () {

        context("with valid layout configuration file 1", function () {
            it("should return a correctly initialised instance", function () {
                expect(tetrahedron).to.be.an.instanceOf(Tetrahedron);
            });
            it("should have set the puzzle instance name", function () {
                expect(tetrahedron.name).to.equal("test");
            });
            it("should have the correct number of Tile Positions on it", function () {
                expect(tetrahedron.tilePositionCount).to.equal(4);
            });
            it("should fail the integrity check", function () {
                const expectedResult =
                    [false, "Face joins not complete: Face: 1, Tile Positions: 1, Joins: \nTilePosition: 1, On Face: 1, Contains Tile: [Empty], Joins: \n"];
                expect(tetrahedron.integrityCheck()).to.eql(expectedResult);
            });
            it("should return the correct toString result", function () {
                const expectedToString = "Puzzle Type: test\n" +
                    "Face: 1, Tile Positions: 1, Joins: \n" +
                    "TilePosition: 1, On Face: 1, Contains Tile: [Empty], Joins: \n" +
                    "Face: 2, Tile Positions: 1, Joins: \n" +
                    "TilePosition: 1, On Face: 2, Contains Tile: [Empty], Joins: \n" +
                    "Face: 3, Tile Positions: 1, Joins: \n" +
                    "TilePosition: 1, On Face: 3, Contains Tile: [Empty], Joins: \n" +
                    "Face: 4, Tile Positions: 1, Joins: \n" +
                    "TilePosition: 1, On Face: 4, Contains Tile: [Empty], Joins: \n";
                expect(tetrahedron.toString()).to.equal(expectedToString);
            });
        });

        context("with an invalid number of faces", function () {
            it("should throw an error", function () {
                const faces: Array<Face> = [face1WithOneTilePosition];
                expect(function () {
                    new Tetrahedron("invalid", faces);
                }).to.throw(Error, "Tetrahedron must always be configured with 4 Faces!");
            });
        });

    });

    describe("if #getTilePositions() is called on an instance of the Tetrahedron", function () {

        context("when all of the TilePositions are empty", function () {
            it("should return a list of all the TilePositions", function () {
                const result = tetrahedron.tilePositions;
                expect(result.length).to.equal(4);
            });
        });

        context("when only some of the TilePositions are empty", function () {
            it("should return a list of all the TilePositions", function () {
                tetrahedron.getFace("1").getTilePosition("1").state.tile = TILE_1;
                tetrahedron.getFace("3").getTilePosition("1").state.tile = TILE_2;
                const result = tetrahedron.tilePositions;
                expect(result.length).to.equal(4);
            });
        });

    });

    describe("if #getEmptyTilePositions() is called on an instance of the Tetrahedron", function () {

        context("when all of the TilePositions are empty", function () {
            it("should return a list of all the TilePositions", function () {
                const result = tetrahedron.emptyTilePositions;
                expect(result.length).to.equal(4);
            });
        });

        context("when only some of the TilePositions are empty", function () {
            it("should return a list of only the empty TilePositions", function () {
                tetrahedron.getFace("1").getTilePosition("1").state.tile = TILE_1;
                tetrahedron.getFace("3").getTilePosition("1").state.tile = TILE_2;
                const result = tetrahedron.emptyTilePositions;
                expect(result.length).to.equal(2);
            });
        });

    });

    describe("if #getFace() is called with the name of a Face on an instance of the Tetrahedron", function () {

        context("when there is a Face with the given name already on the Tetrahedron", function () {
            it("should return the Face details", function () {
                const face = tetrahedron.getFace("3");
                expect(face).to.be.an.instanceOf(Face);
                const expectedToString =
                    "Face: 3, Tile Positions: 1, Joins: \n" +
                    "TilePosition: 1, On Face: 3, Contains Tile: [Empty], Joins: \n";
                expect(face.toString()).to.equal(expectedToString);
            });
        });

        context("when there isn't a Face with the given name on the Tetrahedron", function () {
            it("should throw an error", function () {
                expect(function () {
                    tetrahedron.getFace("A");
                }).to.throw(Error, "Face (A) not found on Tetrahedron!");
            });
        });

    });

});
