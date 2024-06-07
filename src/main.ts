import { invoke } from "@tauri-apps/api/tauri";
import { registerMenuHoverEvent } from "./lib/menuBarLib";
import { registerTabScrollEvent } from "./lib/fileTabLib";

let textContentEl: HTMLDivElement | null;
let menuBarEl: HTMLUListElement | null;
let fileTabEl: HTMLUListElement | null;

fileTabEl = document.querySelector("#file-tabs")!;
menuBarEl = document.querySelector("#menu-bar")!;

registerMenuHoverEvent(menuBarEl);
registerTabScrollEvent(fileTabEl);

window.addEventListener("keydown", (e) => {
    textContentEl = document.querySelector("#text-content")!;
    if (e.ctrlKey && e.key.toLowerCase() === "s") {
        console.log("save to file", textContentEl.innerText)
        // call to rust
    }

    if (e.shiftKey) {
        invoke("greet", {name: "happier"}).then(message => {
            console.log(message)
        })
    }
})