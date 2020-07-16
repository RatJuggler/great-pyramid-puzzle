import test_data from "../test-display-data.json";
import pocket_data from "../pocket-display-data.json";
import great_data from "../great-display-data.json";
import { DisplayData } from "./display-data-schema";
import { DisplayManager } from "./display";


function getDisplayData(puzzleType: string): DisplayData {
    switch (puzzleType) {
        case "Test":
            return test_data;
        case "Pocket":
            return pocket_data;
        case "Great":
            return great_data;
        default:
            throw new Error("Invalid puzzle type option!");
    }
}

function getDisplayManager(displayElement: string | HTMLElement, displayData: DisplayData | string) {
    if (typeof(displayData) === "string") {
        displayData = getDisplayData(<string> displayData);
    }
    return new DisplayManager(displayElement, <DisplayData> displayData);
}

export { getDisplayManager }
