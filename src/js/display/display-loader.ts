import simple_data from "../../data/simple-display-data.json";
import pocket_data from "../../data/pocket-display-data.json";
import great_data from "../../data/great-display-data.json";
import { DisplayData } from "./display-data-schema";
import { DisplayManager } from "./display-manager";


function getDisplayData(puzzleType: string): DisplayData {
    switch (puzzleType) {
        case "Simple":
            return simple_data;
        case "Pocket":
            return pocket_data;
        case "Great":
            return great_data;
        default:
            throw new Error("Invalid puzzle type option!");
    }
}

function getDisplayManager(displayElement: SVGAElement,
                           displayData: DisplayData | string,
                           animationDuration: number = 250) {
    if (typeof(displayData) === "string") {
        displayData = getDisplayData(<string> displayData);
    }
    return new DisplayManager(displayElement, <DisplayData> displayData, animationDuration);
}

export { getDisplayManager }
