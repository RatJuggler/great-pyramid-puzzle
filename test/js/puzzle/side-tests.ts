import { Side } from "../../../src/js/puzzle/side";
import { expect } from 'chai';
import 'mocha';


describe("Side behaviour", function () {

    describe("if #getNumberOfSides is called", function () {

        context("on the SIDES instance", function () {
            it("should return the fixed number of sides", function () {
                expect(Side.numberOfSides).to.equal(3);
            });
        });

    });

    describe("if #validateSide is called", function () {

        context("with valid side identifier 'A'", function () {
            it("should return the definition for side A", function () {
                expect(Side.validateSide("A")).to.equal(Side.sideA);
            });
        });

        context("with valid side identifier 'B'", function () {
            it("should return the definition for side B", function () {
                expect(Side.validateSide("B")).to.equal(Side.sideB);
            });
        });

        context("with valid side identifier 'C'", function () {
            it("should return the definition for side C", function () {
                expect(Side.validateSide("C")).to.equal(Side.sideC);
            });
        });

        context("with an invalid side identifier", function () {
            it("should throw an error", function () {
                expect(function () {
                    Side.validateSide('Z');
                }).to.throw(Error, "Side Z must be one of A, B or C!");
            });
        });

    });

});
