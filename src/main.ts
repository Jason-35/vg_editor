import { DisplayTracker, registerMenuHoverEvent } from "./lib/menuBarLib";
import { registerTabScrollEvent } from "./lib/fileTabLib";
import { openFile, registerFileOptionEvent, newFile, saveFile } from "./lib/options/fileOption";
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
    let manage = contentManagement.contentMap[title]
    if (event.ctrlKey && event.key.toLowerCase() === "s") {
        saveFile()
    }

    if (event.ctrlKey && event.key.toLowerCase() === "o" ) {
        openFile()
    }

    if (event.ctrlKey && event.key.toLowerCase() === "z" ) {
        if(!manage.undoIsEmpty()) {
            let undoContent = manage.undo()!
            manage.insertRedo()
            console.log(manage.redoStack)
            manage.setCurrentContent(undoContent);
            textContentEl!.innerText = undoContent;
        }
    }

    if (event.ctrlKey && event.key.toLowerCase() === "y") {
        console.log(manage.redoStack)
        if(!manage.redoIsEmpty()) {
            let redoContent = manage.redo()!
            console.log(redoContent)
            manage.insertUndo()
            manage.setCurrentContent(redoContent)
            textContentEl!.innerText = redoContent;
        }
    }

    if (event.ctrlKey && event.key.toLowerCase() === "n" ) {
        newFile();
    }
})

document.addEventListener("click", (event) => {
    if (!(menuBarEl?.contains(event.target as Node) && menuBarEl !== event.target)) {
        if (DisplayTracker.currentDisplayOption)
        DisplayTracker.currentDisplayOption.classList.add("hide");
        DisplayTracker.currentDisplayOption = undefined;
    }
})
