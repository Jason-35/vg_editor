import { TextContent } from "./objects/textContent";
import { DisplayTab } from "./fileTabLib";

let typeTimer: number;

export class contentManagement {
    public static contentMap: { [key: string] : TextContent } = {};
}

export function registerTextContentEvent(textContentEl: HTMLDivElement) {
    textContentEl.addEventListener("keypress", (event) => {
        event.stopPropagation();
        clearTimeout(typeTimer);

        if(event.ctrlKey) {
            return;
        }

        typeTimer = setTimeout(() => {
            let manager = contentManagement.contentMap[DisplayTab.currentTab!.id]
            manager.insertUndo()
            manager.setCurrentContent(textContentEl.innerText);
            DisplayTab.fileContent[DisplayTab.currentTab!.id] = textContentEl.innerText;
            contentManagement.contentMap[DisplayTab.currentTab!.id] = manager;
        }, 500);
    })
}
