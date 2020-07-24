import { getPuzzleComponents } from "../../src/js/puzzle-loader";
import { BruteForceSolver } from "../../src/js/solver-brute-force";
import { TileChange, TilePositionChange } from "../../src/js/puzzle-changes";
import { expect } from "chai";
import 'mocha';
// @ts-ignore
import {VALID_TEST_PUZZLE} from "./common-test-data";


describe("BruteForceSolver behaviour", function () {

    describe("if #nextState() is called", function () {

        const components = getPuzzleComponents(VALID_TEST_PUZZLE);
        const solver = new BruteForceSolver(components.tetrahedron, components.tilePool);

        context("for the first time on an instance instantiated for the test puzzle", function () {
            const result = solver.nextState() as TileChange;
            it("should return a Place TileChange for position 1-1 with tile 1", function () {
                expect(result).to.be.an.instanceOf(TileChange);
                expect(result.type).to.equal("Place");
                expect(result.tilePositionId).to.equal("1-1");
                expect(result.tileId).to.equal(1);
            });
        });
        context("for the second time on an instance instantiated for the test puzzle", function () {
            const result = solver.nextState() as TileChange;
            it("should return a Place TileChange for position 2-1 with tile 2", function () {
                expect(result).to.be.an.instanceOf(TileChange);
                expect(result.type).to.equal("Place");
                expect(result.tilePositionId).to.equal("2-1");
                expect(result.tileId).to.equal(2);
            });
        });
        context("for the third time on an instance instantiated for the test puzzle", function () {
            const result = solver.nextState() as TileChange;
            it("should return a Place TileChange for position 3-1 with tile 3", function () {
                expect(result).to.be.an.instanceOf(TileChange);
                expect(result.type).to.equal("Place");
                expect(result.tilePositionId).to.equal("3-1");
                expect(result.tileId).to.equal(3);
            });
        });
        context("for the fourth time on an instance instantiated for the test puzzle", function () {
            const result = solver.nextState() as TilePositionChange;
            it("should return a Rotate TilePositionChange for position 3-1", function () {
                expect(result).to.be.an.instanceOf(TilePositionChange);
                expect(result.type).to.equal("Rotate");
                expect(result.tilePositionId).to.equal("3-1");
            });
        });
        context("for the fifth time on an instance instantiated for the test puzzle", function () {
            const result = solver.nextState() as TilePositionChange;
            it("should return a Rotate TilePositionChange for position 3-1", function () {
                expect(result).to.be.an.instanceOf(TilePositionChange);
                expect(result.type).to.equal("Rotate");
                expect(result.tilePositionId).to.equal("3-1");
            });
        });
        context("for the sixth time on an instance instantiated for the test puzzle", function () {
            const result = solver.nextState() as TileChange;
            it("should return a Remove TileChange for position 3-1 with tile 3", function () {
                expect(result).to.be.an.instanceOf(TileChange);
                expect(result.type).to.equal("Remove");
                expect(result.tilePositionId).to.equal("3-1");
                expect(result.tileId).to.equal(3);
            });
        });

    });

});
