import { DisplayTracker, registerMenuHoverEvent } from "./lib/menuBarLib";
import { registerTabScrollEvent } from "./lib/fileTabLib";
import { openFile, registerFileOptionEvent, newFile, saveFile, saveAsFile, closeFile } from "./lib/options/fileOption";
import { registerTextContentEvent } from "./lib/textLib";
import { copy, redo, registerEditOptionEvent, undo } from "./lib/options/editOption";

let textContentEl: HTMLDivElement | null;
let fileOption: HTMLDivElement | null;
let editOption: HTMLDivElement | null;
let viewOption: HTMLDivElement | null;
let settingOption: HTMLDivElement | null;
let menuBarEl: HTMLUListElement | null;
let fileTabEl: HTMLUListElement | null;

fileOption = document.querySelector(".file")!
editOption = document.querySelector(".edit")!
viewOption = document.querySelector(".view")!
settingOption = document.querySelector(".setting")!

fileTabEl = document.querySelector("#file-tabs")!;
menuBarEl = document.querySelector("#menu-bar")!;
textContentEl = document.querySelector("#text-content")!;

registerFileOptionEvent(fileOption);
registerEditOptionEvent(editOption);
registerMenuHoverEvent(menuBarEl);
registerTabScrollEvent(fileTabEl);
registerTextContentEvent(textContentEl);

newFile()
window.addEventListener("keydown", (event: KeyboardEvent) => {
    event.stopPropagation();
    
    if (event.ctrlKey && event.key.toLowerCase() === "s") {
        saveFile()
    }

    if (event.ctrlKey && event.key.toLowerCase() === "o" ) {
        openFile()
    }

    if (event.ctrlKey && event.key.toLowerCase() === "z" ) {
        undo()
    }

    if (event.ctrlKey && event.key.toLowerCase() === "y") {
        redo()
    }

    if (event.ctrlKey && event.key.toLowerCase() === "n" ) {
        newFile();
    }

    if (event.ctrlKey && event.key.toLowerCase() === "s" && event.shiftKey) {
        saveAsFile()
    }

    if (event.ctrlKey && event.key.toLowerCase() === "w") {
        closeFile()
    }

    if (event.ctrlKey && event.key.toLowerCase() === "f") {
        copy()
    }
})

document.addEventListener("click", (event) => {
    if (!(menuBarEl?.contains(event.target as Node) && menuBarEl !== event.target)) {
        if (DisplayTracker.currentDisplayOption)
        DisplayTracker.currentDisplayOption.classList.add("hide");
        DisplayTracker.currentDisplayOption = undefined;
    }
})
