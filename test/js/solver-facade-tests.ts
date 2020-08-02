import valid_display1 from "../valid-test-display-data1.json";
import { UIOptions } from "../../src/js/ui-options";
import { getDisplayManager } from "../../src/js/display-loader";
import { DisplayManager } from "../../src/js/display-manager";
import { StatusUpdatesManager } from "../../src/js/status-updates-manager";
import { getSolverFacade, AnimatedFacade } from "../../src/js/solver-facade";
import { expect } from "chai";
import 'mocha';
// @ts-ignore
import { createSVGWindow } from 'svgdom';
// @ts-ignore
import { registerWindow } from "@svgdotjs/svg.js";


class MockUIOptions implements UIOptions {
    public readonly animationSpeed = 250;
    public readonly solverOptions = {
        puzzleType: "Simple",
        solveAlgorithm: "NoMatching",
        tileSelection: "Random",
        tilePlacement: "Random",
        tileRotation: "Random"
    }
    constructor(public readonly displayOption: string) {}
}

function createDocument(): Document {
    const window = createSVGWindow();
    const document = window.document;
    registerWindow(window, document);
    return document;
}

type SolverFacadeArguments = {
    mockUIOptions: MockUIOptions;
    displayManager: DisplayManager;
    statusUpdates: StatusUpdatesManager;
    continueButton: HTMLButtonElement;
    overlay: HTMLDivElement
}

function createSolverFacadeArguments(displayOption: string): SolverFacadeArguments {
    const document = createDocument();
    const statusUpdatesList = document.createElement("li");
    return {
        mockUIOptions: new MockUIOptions(displayOption),
        displayManager: getDisplayManager(document.documentElement, valid_display1.testDisplayData),
        statusUpdates: new StatusUpdatesManager(document, statusUpdatesList),
        continueButton: document.createElement("button"),
        overlay: document.createElement("div")
    }
}

describe("SolverFacade behaviour", function () {

    describe("if #getSolverFacade() is called", function () {

        context("and an invalid display option is set", function () {
            const facadeArgs = createSolverFacadeArguments("Error");
            it("should throw an error", function () {
                expect(function () {
                    getSolverFacade(facadeArgs.mockUIOptions, facadeArgs.displayManager, facadeArgs.statusUpdates,
                        facadeArgs.continueButton, facadeArgs.overlay);
                }).to.throw(Error, "Invalid solver display option!");
            });
        });

    });

    describe("if #getSolverFacade() is called", function () {

        context("and the animated display option is set", function () {
            const facadeArgs = createSolverFacadeArguments("Animated");
            const result = getSolverFacade(facadeArgs.mockUIOptions, facadeArgs.displayManager, facadeArgs.statusUpdates,
                facadeArgs.continueButton, facadeArgs.overlay);
            it("should return an instance of AnimatedFacade", function () {
                expect(result).to.be.an.instanceof(AnimatedFacade);
            });
        });

    });

    describe("if #getSolverFacade() is called", function () {

        context("and the worker option is set", function () {
            // const facadeArgs = createSolverFacadeArguments("Completed");
            // const result = getSolverFacade(facadeArgs.mockUIOptions, facadeArgs.displayManager, facadeArgs.statusUpdates,
            //     facadeArgs.continueButton, facadeArgs.overlay);
            // it("should return an instance of WorkerFacade", function () {
            //     expect(result).to.be.an.instanceof(WorkerFacade);
            // });
        });

    });

});
