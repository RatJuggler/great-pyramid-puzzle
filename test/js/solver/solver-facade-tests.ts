import valid_display1 from "../data/valid-test-display-data1.json";
import { UIOptions } from "../../../src/js/ui-options";
import { getDisplayManager } from "../../../src/js/display/display-loader";
import { DisplayManager } from "../../../src/js/display/display-manager";
import { StatusUpdatesManager } from "../../../src/js/status-updates-manager";
import { getSolverFacade, AnimatedFacade, HumanFacade } from "../../../src/js/solver/solver-facade";
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
        tileRotation: "None"
    }
    constructor(public readonly solutionOption: string) {}
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
        displayManager: getDisplayManager(<SVGSVGElement> <any> document.documentElement, valid_display1.testDisplayData),
        statusUpdates: new StatusUpdatesManager(document, statusUpdatesList),
        continueButton: document.createElement("button"),
        overlay: document.createElement("div")
    }
}

describe("SolverFacade behaviour", function () {

    describe("if #getSolverFacade() is called", function () {

        context("and an invalid solution option is set", function () {
            it("should throw an error", function () {
                const facadeArgs = createSolverFacadeArguments("Error");
                expect(function () {
                    getSolverFacade(facadeArgs.mockUIOptions, facadeArgs.displayManager, facadeArgs.statusUpdates,
                        facadeArgs.continueButton, facadeArgs.overlay);
                }).to.throw(Error, "Invalid solution option!");
            });
        });

        context("and the animated solution option is set", function () {
            it("should return an instance of AnimatedFacade", function () {
                const facadeArgs = createSolverFacadeArguments("Animated");
                const result = getSolverFacade(facadeArgs.mockUIOptions, facadeArgs.displayManager, facadeArgs.statusUpdates,
                    facadeArgs.continueButton, facadeArgs.overlay);
                expect(result).to.be.an.instanceof(AnimatedFacade);
            });
        });

        context("and the worker solution option is set", function () {
            // it("should return an instance of WorkerFacade", function () {
            //     const facadeArgs = createSolverFacadeArguments("Completed");
            //     const result = getSolverFacade(facadeArgs.mockUIOptions, facadeArgs.displayManager, facadeArgs.statusUpdates,
            //         facadeArgs.continueButton, facadeArgs.overlay);
            //     expect(result).to.be.an.instanceof(WorkerFacade);
            // });
        });

        context("and the human solution option is set", function () {
            it("should return an instance of HumanFacade", function () {
                const facadeArgs = createSolverFacadeArguments("Human");
                const result = getSolverFacade(facadeArgs.mockUIOptions, facadeArgs.displayManager, facadeArgs.statusUpdates,
                    facadeArgs.continueButton, facadeArgs.overlay);
                expect(result).to.be.an.instanceof(HumanFacade);
            });
        });

    });

    describe("if #start() is called", function () {

        context("on an instance of the AnimatedFacade", function () {
            // it("should produce an animated solution", function () {
            //     const facadeArgs = createSolverFacadeArguments("Animated");
            //     const result = getSolverFacade(facadeArgs.mockUIOptions, facadeArgs.displayManager, facadeArgs.statusUpdates,
            //         facadeArgs.continueButton, facadeArgs.overlay);
            //     expect(result.start());
            // });
        });

        context("on an instance of the WorkerFacade", function () {
            // const facadeArgs = createSolverFacadeArguments("Completed");
            // const result = getSolverFacade(facadeArgs.mockUIOptions, facadeArgs.displayManager, facadeArgs.statusUpdates,
            //     facadeArgs.continueButton, facadeArgs.overlay);
            // it("should produce a completed solution", function () {
            //     expect(result.start());
            // });
        });

        context("on an instance of the HumanFacade", function () {
            // it("should produce a human solution", function () {
            //     const facadeArgs = createSolverFacadeArguments("Human");
            //     const result = getSolverFacade(facadeArgs.mockUIOptions, facadeArgs.displayManager, facadeArgs.statusUpdates,
            //         facadeArgs.continueButton, facadeArgs.overlay);
            //     expect(result.start());
            // });
        });

    });

});
