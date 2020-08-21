import { SolverTimer } from "../../../src/js/solver/solver-timer";
import { expect } from 'chai';
import 'mocha';
// @ts-ignore
import { MockStatusUpdates } from "../status-updates-manager-tests";


function wait(seconds: number): void {
    const until = Date.now() + (seconds * 1000);
    while (Date.now() < until) {}
}

describe("SolverTimer behaviour", function () {

    const expected = /Replace: solver-timer - Started : \d\d:\d\d:\d\d\nFinished: \d\d:\d\d:\d\d\nElapsed : \d\d:\d\d:\d\d\nTotal   : \d\d:\d\d:\d\d/;

    let mockStatusUpdates: MockStatusUpdates;
    let timer: SolverTimer;

    beforeEach(function () {
        mockStatusUpdates = new MockStatusUpdates();
        timer = new SolverTimer(mockStatusUpdates);
    });

    this.timeout(4000);

    describe("if #start() is called", function () {

        context("on a newly created instance", function () {
            it("should start the timer and create a status update", function () {
                timer.start();
                const expectedResult = "Add: solver-timer - Timer - Starting...";
                expect(mockStatusUpdates.mockStatus).to.equal(expectedResult);
                timer.stop();
            });
        });

        context("on a instance that has already been started", function () {
            it("should throw an error", function () {
                timer.start();
                expect(function () {
                    timer.start();
                }).to.throw(Error, "Timer already started!");
                timer.stop();
            });
        });

        context("on a instance that has already been continued", function () {
            it("should throw an error", function () {
                timer.start();
                wait(1);
                timer.stop();
                wait(1);
                timer.continue();
                expect(function () {
                    timer.start();
                }).to.throw(Error, "Timer already started!");
                timer.stop();
            });
        });

        context("on a instance that has already been cancelled", function () {
            it("should start the timer and create a status update", function () {
                timer.start();
                wait(1);
                timer.cancel();
                wait(1);
                timer.start();
                const expectedResult = "Add: solver-timer - Timer - Starting...";
                expect(mockStatusUpdates.mockStatus).to.equal(expectedResult);
                timer.stop();
            });
        });

        context("on a instance that has already been stopped", function () {
            it("should start the timer and create a status update", function () {
                timer.start();
                wait(1);
                timer.stop();
                wait(1);
                timer.start();
                const expectedResult = "Add: solver-timer - Timer - Starting...";
                expect(mockStatusUpdates.mockStatus).to.equal(expectedResult);
                timer.stop();
            });
        });

    });

    describe("if #stop() is called", function () {

        context("on a newly created instance", function () {
            it("should throw an error", function () {
                expect(function () {
                    timer.stop();
                }).to.throw(Error, "Timer already stopped!");
            });
        });

        context("on a instance that has already been started and stopped", function () {
            it("should throw an error", function () {
                timer.start();
                wait(1);
                timer.stop();
                expect(function () {
                    timer.stop();
                }).to.throw(Error, "Timer already stopped!");
            });
        });

        context("on a instance that has already been started and cancelled", function () {
            it("should throw an error", function () {
                timer.start();
                wait(1);
                timer.cancel();
                expect(function () {
                    timer.stop();
                }).to.throw(Error, "Timer already stopped!");
            });
        });

        context("on a instance that has already been started", function () {
            it("should continue the timer and create a status update", function () {
                timer.start();
                wait(1);
                timer.stop();
                expect(mockStatusUpdates.mockStatus).to.match(expected);
            });
        });

    });

    describe("if #cancel() is called", function () {

        context("on a newly created instance", function () {
            it("should throw an error", function () {
                expect(function () {
                    timer.cancel();
                }).to.throw(Error, "Timer never started!");
            });
        });

        context("on a instance that has already been started and stopped", function () {
            it("should throw an error", function () {
                timer.start();
                wait(1);
                timer.stop();
                expect(function () {
                    timer.cancel();
                }).to.throw(Error, "Timer already stopped!");
            });
        });

        context("on a instance that has already been started and cancelled", function () {
            it("should throw an error", function () {
                timer.start();
                wait(1);
                timer.cancel();
                expect(function () {
                    timer.cancel();
                }).to.throw(Error, "Timer already stopped!");
            });
        });

        context("on a instance that has already been started", function () {
            it("should continue the timer and create a status update", function () {
                timer.start();
                wait(1);
                timer.cancel();
                const expectedResult = "Add: solver-timer - Timer - Starting...AddTo: solver-timer - \nCancelled!";
                expect(mockStatusUpdates.mockStatus).to.equal(expectedResult);
            });
        });

    });

    describe("if #continue() is called", function () {

        context("on a newly created instance", function () {
            it("should throw an error", function () {
                expect(function () {
                    timer.continue();
                }).to.throw(Error, "Timer can't continue if it has never been started!");
            });
        });

        context("on a instance that has already been started but not stopped", function () {
            it("should throw an error", function () {
                timer.start();
                wait(1);
                expect(function () {
                    timer.continue();
                }).to.throw(Error, "Timer already running!");
                timer.stop();
            });
        });

        context("on a instance that has already been started and stopped", function () {
            it("should continue the timer and create a status update", function () {
                timer.start();
                wait(1);
                timer.stop();
                wait(1);
                timer.continue();
                expect(mockStatusUpdates.mockStatus).to.match(expected);
                timer.stop();
            });
        });

    });

});
