import { DisplayTracker } from "./menuBarLib";

export function registerTextClickedEvent(textContentEl: HTMLDivElement) {
    textContentEl.addEventListener("click", () => {
        if (DisplayTracker.currentDisplayOption) {
            DisplayTracker.currentDisplayOption.classList.add("hide");
            DisplayTracker.currentDisplayOption = undefined;
        } 
    })
}