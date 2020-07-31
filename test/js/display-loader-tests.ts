import { getDisplayManager } from "../../src/js/display-loader";
import { DisplayManager } from "../../src/js/display-manager";
import { expect } from 'chai';
import 'mocha';
// @ts-ignore
import { createSVGWindow } from 'svgdom';


describe("if #getDisplayManager() is called", function () {

    context("with a puzzle type display data argument of 'Simple'", function () {
        const window = createSVGWindow();
        const result = getDisplayManager(window.document,"Simple");
        it("should return a valid DisplayManager", function () {
            expect(result).to.be.an.instanceOf(DisplayManager);
        });
    });

    context("with a puzzle type display data argument of 'Pocket'", function () {
        const window = createSVGWindow();
        const result = getDisplayManager(window.document,"Pocket");
        it("should return a valid DisplayManager", function () {
            expect(result).to.be.an.instanceOf(DisplayManager);
        });
    });

    context("with a puzzle type display data argument of 'Great'", function () {
        const window = createSVGWindow();
        const result = getDisplayManager(window.document,"Great");
        it("should return a valid DisplayManager", function () {
            expect(result).to.be.an.instanceOf(DisplayManager);
        });
    });

    context("with invalid puzzle type display data argument", function () {
        const window = createSVGWindow();
        it("should throw an error", function () {
            expect(function () {
                getDisplayManager(window, "invalid");
            }).to.throw(Error, "Invalid puzzle type option!");
        });
    });

});
