import valid_layout_config1 from "../data/valid-test-layout-data1.json";
import { Tetrahedron } from "../../../src/js/puzzle/tetrahedron";
import { TilePosition } from '../../../src/js/puzzle/tile-position';
import { Side } from "../../../src/js/puzzle/side";
import { expect } from 'chai';
import 'mocha';
// @ts-ignore
import { TILE_1, TILE_2, TILE_3, TILE_4 } from "../common-test-data";


describe("TilePosition behaviour", function () {

    describe("when a new TilePosition is first created", function () {

        context("without joining to any other TilePositions", function () {
            const tilePosition = new TilePosition("XYZ", "1");
            it("should return a correctly initialised instance", function () {
                expect(tilePosition).to.be.an.instanceOf(TilePosition);
            });
            it("should return the correct toString result", function () {
                const expectedToString = "TilePosition: XYZ, On Face: 1, Contains Tile: [Empty], Joins: ";
                expect(tilePosition.toString()).to.equal(expectedToString);
            });
            it("should fail the integrity check", function () {
                const expectedFailure =
                    [false, "Tile position joins not complete: TilePosition: XYZ, On Face: 1, Contains Tile: [Empty], Joins: "];
                expect(tilePosition.integrityCheck()).to.eql(expectedFailure)
            });
        });

        context("and then joined to three other TilePositions", function () {
            const tilePosition = new TilePosition("XYZ", "1");
            const tilePosition1 = new TilePosition("TP1", "1");
            const tilePosition2 = new TilePosition("TP2", "1");
            const tilePosition3 = new TilePosition("TP3", "1");
            tilePosition.join("A", "B", tilePosition1);
            tilePosition.join("B", "C", tilePosition2);
            tilePosition.join("C", "A", tilePosition3);
            it("should return the correct toString result", function () {
                const expectedToString =
                    "TilePosition: XYZ, On Face: 1, Contains Tile: [Empty], Joins: (XYZ-A->1-TP1-B)(XYZ-B->1-TP2-C)(XYZ-C->1-TP3-A)";
                expect(tilePosition.toString()).to.equal(expectedToString);
            });
            it("should pass the integrity check", function () {
                expect(tilePosition.integrityCheck()).to.eql([true, "Passed"]);
            });
        });

    });

    describe("if #join() is called to join one TilePosition to another", function () {

        context("with valid side names for the two different TilePositions to be joined", function () {
            const tilePosition1 = new TilePosition("TP1", "1");
            const tilePosition2 = new TilePosition("TP2", "1");
            tilePosition1.join("A", "B", tilePosition2);
            it("should join the TilePositions in the direction given", function () {
                const tile1ExpectedToString = "TilePosition: TP1, On Face: 1, Contains Tile: [Empty], Joins: (TP1-A->1-TP2-B)";
                expect(tilePosition1.toString()).to.equal(tile1ExpectedToString);
            });
            it("should not join the TilePositions in the opposite direction", function () {
                const tile2ExpectedToString = "TilePosition: TP2, On Face: 1, Contains Tile: [Empty], Joins: ";
                expect(tilePosition2.toString()).to.equal(tile2ExpectedToString);
            });
        });

        context("where the TilePosition to join to is the same as the one you are joining from", function () {
            const tilePosition1 = new TilePosition("TP1", "1");
            it("should throw an error", function () {
                expect(function () {
                    tilePosition1.join("A", "B", tilePosition1);
                }).to.throw(Error, "Cannot join a TilePosition to itself!");
            });
        });

        context("where the side name to join from is invalid", function () {
            const tilePosition1 = new TilePosition("TP1", "1");
            const tilePosition2 = new TilePosition("TP2", "1");
            it("should throw an error", function () {
                expect(function () {
                    tilePosition1.join("1", "A", tilePosition2);
                }).to.throw(Error, "Side to join from must be one of A,B,C!");
            });
        });

        context("where the side name to join to is invalid", function () {
            const tilePosition1 = new TilePosition("TP1", "1");
            const tilePosition2 = new TilePosition("TP2", "1");
            it("should throw an error", function () {
                expect(function () {
                    tilePosition1.join("A", "X", tilePosition2);
                }).to.throw(Error, "Side to join to must be one of A,B,C!");
            });
        });

        context("where there is already a join for the side given", function () {
            const tilePosition1 = new TilePosition("TP1", "1");
            const tilePosition2 = new TilePosition("TP2", "1");
            const tilePosition3 = new TilePosition("TP3", "1");
            tilePosition1.join("A", "B", tilePosition2);
            it("should throw an error", function () {
                expect(function () {
                    tilePosition1.join("A", "B", tilePosition3);
                }).to.throw(Error, "Existing join already present for side A!");
            })
        })

        context("where the TilePosition is already joined to three others", function () {
            const tilePosition = new TilePosition("TP", "1");
            const tilePosition1 = new TilePosition("TP1", "1");
            const tilePosition2 = new TilePosition("TP2", "1");
            const tilePosition3 = new TilePosition("TP3", "1");
            const tilePosition4 = new TilePosition("TP4", "1");
            tilePosition.join("A", "B", tilePosition1);
            tilePosition.join("B", "C", tilePosition2);
            tilePosition.join("C", "A", tilePosition3);
            it("should throw an error", function () {
                expect(function () {
                    tilePosition.join("A", "A", tilePosition4);
                }).to.throw(Error, "TilePositions can only join to three other TilePositions!");
            })
        })

    });

    describe("if #tilesMatch() is called to check if the Tile at a TilePosition matches with a single adjoining TilePosition", function () {

        context("and the TilePosition being checked is empty", function () {
            const tilePosition1 = new TilePosition("TP1", "1");
            const tilePosition2 = new TilePosition("TP2", "2");
            tilePosition1.join("C", "B", tilePosition2);
            it("should throw an error", function () {
                expect(function () {
                    tilePosition1.tilesMatch();
                }).to.throw(Error, "Can't check if a Tile matches when there is no Tile at the TilePosition to match from!");
            });
        });

        context("and the TilePosition being checked has a Tile in it but the adjoining TilePosition doesn't", function () {
            const tilePosition1 = new TilePosition("TP1", "1");
            const tilePosition2 = new TilePosition("TP2", "2");
            tilePosition1.join("C", "B", tilePosition2);
            tilePosition1.state.tile = TILE_1;
            const result = tilePosition1.tilesMatch();
            it("should return true for the first TilePosition", function () {
                expect(result).to.be.true;
            });
        });

        context("and the two adjoining TilePositions each have a Tile, but the sides don't match", function () {
            const tilePosition1 = new TilePosition("TP1", "1");
            const tilePosition2 = new TilePosition("TP2", "2");
            tilePosition1.join("C", "B", tilePosition2);
            tilePosition1.state.tile = TILE_1;
            tilePosition2.state.tile = TILE_3;
            const result = tilePosition1.tilesMatch();
            it("should return false", function () {
                expect(result).to.be.false;
            });
        });

        context("and the two adjoining TilePositions each have a Tile, and the sides match", function () {
            const tilePosition1 = new TilePosition("TP1", "1");
            const tilePosition2 = new TilePosition("TP2", "2");
            tilePosition1.join("C", "B", tilePosition2);
            tilePosition1.state.tile = TILE_1;
            tilePosition2.state.tile = TILE_2;
            const result = tilePosition1.tilesMatch();
            it("should return true", function () {
                expect(result).to.be.true;
            });
        });

    });

    describe("if #tilesMatch() is called to check a Tile and there are three adjoining TilePositions", function () {

        context("and the three adjoining TilePositions each have a Tile, but not all the sides match", function () {
            const tilePosition1 = new TilePosition("TP1", "1");
            const tilePosition2 = new TilePosition("TP2", "2");
            const tilePosition3 = new TilePosition("TP3", "3");
            const tilePosition4 = new TilePosition("TP4", "4");
            tilePosition1.join("A", "B", tilePosition3);
            tilePosition1.join("B", "B", tilePosition4);
            tilePosition1.join("C", "B", tilePosition2);
            tilePosition1.state.tile = TILE_2;
            tilePosition2.state.tile = TILE_3;
            tilePosition3.state.tile = TILE_1;
            tilePosition4.state.tile = TILE_4;
            const result = tilePosition1.tilesMatch();
            it("should return false", function () {
                expect(result).to.be.false;
            });
        });

        context("and the three adjoining TilePositions each have a Tile, and all the sides match", function () {
            const tilePosition1 = new TilePosition("TP1", "1");
            const tilePosition2 = new TilePosition("TP2", "2");
            const tilePosition3 = new TilePosition("TP3", "3");
            const tilePosition4 = new TilePosition("TP4", "4");
            tilePosition1.join("A", "B", tilePosition3);
            tilePosition1.join("B", "B", tilePosition4);
            tilePosition1.join("C", "B", tilePosition2);
            tilePosition1.state.tile = TILE_2;
            tilePosition2.state.tile = TILE_3;
            tilePosition3.state.tile = TILE_1;
            tilePosition3.state.rotate();
            tilePosition3.state.rotate();
            tilePosition4.state.tile = TILE_4;
            tilePosition4.state.rotate();
            const result = tilePosition1.tilesMatch();
            it("should return true", function () {
                expect(result).to.be.true;
            });
        });

    });

    describe("if #tilesMatch() is called on all the TilePositions of a Test puzzle", function () {

        context("and the three adjoining TilePositions each with a Tile, but not all the sides match", function () {
            const validLayoutData = valid_layout_config1.testLayoutData;
            const tetrahedron =
                new Tetrahedron(validLayoutData.puzzle, validLayoutData.numberOfTilesPerFace, validLayoutData.faces);
            const tilePositions = tetrahedron.tilePositions;
            const tilePosition1 = tilePositions[0];
            const tilePosition2 = tilePositions[1];
            const tilePosition3 = tilePositions[2];
            const tilePosition4 = tilePositions[3];
            tilePosition1.state.tile = TILE_2;
            tilePosition2.state.tile = TILE_3;
            tilePosition3.state.tile = TILE_1;
            tilePosition4.state.tile = TILE_4;
            const result1 = tilePosition1.tilesMatch();
            const result2 = tilePosition2.tilesMatch();
            const result3 = tilePosition3.tilesMatch();
            const result4 = tilePosition4.tilesMatch();
            it("should return false for the first TilePosition", function () {
                expect(result1).to.be.false;
            });
            it("should return false for the second TilePosition", function () {
                expect(result2).to.be.false;
            });
            it("should return false for the third TilePosition", function () {
                expect(result3).to.be.false;
            });
            it("should return false for the fourth TilePosition", function () {
                expect(result4).to.be.false;
            });
        });

        context("and the three adjoining TilePositions each with a Tile, and all the sides match", function () {
            const validLayoutData = valid_layout_config1.testLayoutData;
            const tetrahedron =
                new Tetrahedron(validLayoutData.puzzle, validLayoutData.numberOfTilesPerFace, validLayoutData.faces);
            const tilePositions = tetrahedron.tilePositions;
            const tilePosition1 = tilePositions[0];
            const tilePosition2 = tilePositions[1];
            const tilePosition3 = tilePositions[2];
            const tilePosition4 = tilePositions[3];
            tilePosition1.state.tile = TILE_2;
            tilePosition2.state.tile = TILE_3;
            tilePosition3.state.tile = TILE_1;
            tilePosition3.state.rotate();
            tilePosition3.state.rotate();
            tilePosition4.state.tile = TILE_4;
            tilePosition4.state.rotate();
            const result1 = tilePosition1.tilesMatch();
            const result2 = tilePosition2.tilesMatch();
            const result3 = tilePosition3.tilesMatch();
            const result4 = tilePosition4.tilesMatch();
            it("should return true for the first TilePosition", function () {
                expect(result1).to.be.true;
            });
            it("should return true for the second TilePosition", function () {
                expect(result2).to.be.true;
            });
            it("should return true for the third TilePosition", function () {
                expect(result3).to.be.true;
            });
            it("should return true for the fourth TilePosition", function () {
                expect(result4).to.be.true;
            });
        });

    });

    describe("if #segmentsToFind() is called to determine the segments for a Tile to fit a TilePosition with a single adjoining TilePosition",
        function () {

        context("and the TilePosition being checked already has a Tile in it", function () {
            const tilePosition1 = new TilePosition("TP1", "1");
            const tilePosition2 = new TilePosition("TP2", "2");
            tilePosition1.join("C", "B", tilePosition2);
            tilePosition1.state.tile = TILE_1;
            it("should throw an error", function () {
                expect(function () {
                    tilePosition1.segmentsToFind();
                }).to.throw(Error, "TilePosition to find segments for already contains a Tile!");
            });
        });

        context("and the adjoining TilePosition doesn't have a Tile in it", function () {
            const tilePosition1 = new TilePosition("TP1", "1");
            const tilePosition2 = new TilePosition("TP2", "2");
            tilePosition1.join("C", "B", tilePosition2);
            const result = tilePosition1.segmentsToFind();
            it("should return the 'any' segment search", function () {
                expect(result).to.equal("....");
            });
        });

        context("and the adjoining TilePosition has a Tile in it", function () {
            const tilePosition1 = new TilePosition("TP1", "1");
            const tilePosition2 = new TilePosition("TP2", "2");
            tilePosition1.join("C", "B", tilePosition2);
            tilePosition2.state.tile = TILE_3;
            const result = tilePosition1.segmentsToFind();
            it("should return the segments side B reversed", function () {
                expect(result).to.equal(TILE_3.getSegmentsForSideToMatchWith(0, Side.SideB));
            });
        });

    });

    describe("if #segmentsToFind() is called to determine the segments for a Tile to fit a TilePosition with three adjoining TilePositions", function () {

        context("and none of the three adjoining TilePositions have a Tile", function () {
            const tilePosition1 = new TilePosition("TP1", "1");
            const tilePosition2 = new TilePosition("TP2", "2");
            const tilePosition3 = new TilePosition("TP3", "3");
            const tilePosition4 = new TilePosition("TP4", "4");
            tilePosition1.join("A", "B", tilePosition3);
            tilePosition1.join("B", "B", tilePosition4);
            tilePosition1.join("C", "B", tilePosition2);
            const result = tilePosition1.segmentsToFind();
            it("should return the 'any' segment search for all sides", function () {
                expect(result).to.equal("............")
            });
        });

        context("and the three adjoining TilePositions each have a Tile", function () {
            const tilePosition1 = new TilePosition("TP1", "1");
            const tilePosition2 = new TilePosition("TP2", "2");
            const tilePosition3 = new TilePosition("TP3", "3");
            const tilePosition4 = new TilePosition("TP4", "4");
            tilePosition1.join("A", "B", tilePosition3);
            tilePosition1.join("B", "B", tilePosition4);
            tilePosition1.join("C", "B", tilePosition2);
            tilePosition2.state.tile = TILE_3;
            tilePosition3.state.tile = TILE_1;
            tilePosition3.state.rotate();
            tilePosition3.state.rotate();
            tilePosition4.state.tile = TILE_4;
            tilePosition4.state.rotate();
            const result = tilePosition1.segmentsToFind();
            it("should return true", function () {
                expect(result).to.equal(TILE_2.segments);
            });
        });

    });

});
