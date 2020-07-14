import { SIDES, Side } from "../../src/js/side";
import { expect } from 'chai';
import 'mocha';


describe("Side behaviour", function () {

    describe("if #getNumberOfSides is called", function () {

        context("on the SIDES instance", function () {
            it("should return the fixed number of sides", function () {
                expect(SIDES.numberOfSides).to.equal(3);
            });
        });

    });

    describe("if #validateSide is called", function () {

        context("with valid side identifier 'A'", function () {
            it("should the definition for side A", function () {
                expect(SIDES.validateSide("A", "test A")).to.equal(Side.SideA);
            });
        });

        context("with valid side identifier 'B'", function () {
            it("should the definition for side B", function () {
                expect(SIDES.validateSide("B", "test B")).to.equal(Side.SideB);
            });
        });

        context("with valid side identifier 'C'", function () {
            it("should the definition for side C", function () {
                expect(SIDES.validateSide("C", "test C")).to.equal(Side.SideC);
            });
        });

        context("with an invalid side identifier", function () {
            it("should throw an error", function () {
                expect(function () {
                    SIDES.validateSide('Z', "test Z");
                }).to.throw(Error, "Side test Z must be one of A,B,C!");
            });
        });

    });

});
