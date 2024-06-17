import { DisplayTracker, registerMenuHoverEvent } from "./lib/menuBarLib";
import { registerTabScrollEvent } from "./lib/fileTabLib";
import { openFile, registerFileOptionEvent } from "./lib/options/fileOption";
import { registerTextContentEvent } from "./lib/textLib";
import { contentManagement } from "./lib/textLib";
import { DisplayTab } from "./lib/fileTabLib";

let textContentEl: HTMLDivElement | null;
let fileOption: HTMLDivElement | null;
let menuBarEl: HTMLUListElement | null;
let fileTabEl: HTMLUListElement | null;

fileOption = document.querySelector(".file")!
fileTabEl = document.querySelector("#file-tabs")!;
console.log(fileTabEl, "???");
menuBarEl = document.querySelector("#menu-bar")!;
textContentEl = document.querySelector("#text-content")!;

registerFileOptionEvent(fileOption);
registerMenuHoverEvent(menuBarEl);
registerTabScrollEvent(fileTabEl);
registerTextContentEvent(textContentEl);

window.addEventListener("keydown", (event: KeyboardEvent) => {
    event.stopPropagation();
    let title = DisplayTab.currentTab!.id
    if (event.ctrlKey && event.key.toLowerCase() === "s") {
        console.log("save to file", textContentEl?.innerText)
        // call to rust
    }

    if (event.ctrlKey && event.key.toLowerCase() === "o" ) {
        openFile()
    }

    if (event.ctrlKey && event.key.toLowerCase() === "z" ) {
        event.stopPropagation();
        let manage = contentManagement.contentMap[title]
        if(!manage.undoIsEmpty()) {
            let undoContent = manage.undo()!
            manage.insertRedo()
            manage.setCurrentContent(undoContent);
            textContentEl!.innerText = undoContent;
        }
    }

    if (event.ctrlKey && event.key.toLowerCase() === "p" ) {
        console.log("redo")
    }
})

document.addEventListener("click", (event) => {
    if (!(menuBarEl?.contains(event.target as Node) && menuBarEl !== event.target)) {
        if (DisplayTracker.currentDisplayOption)
        DisplayTracker.currentDisplayOption.classList.add("hide");
        DisplayTracker.currentDisplayOption = undefined;
    }
})
