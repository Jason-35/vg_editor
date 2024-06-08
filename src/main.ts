import { registerMenuHoverEvent } from "./lib/menuBarLib";
import { registerTabScrollEvent } from "./lib/fileTabLib";
import { openFile, registerFileOptionEvent } from "./lib/options/fileOption";

let textContentEl: HTMLDivElement | null;
let fileOption: HTMLDivElement | null;
let menuBarEl: HTMLUListElement | null;
let fileTabEl: HTMLUListElement | null;

fileOption = document.querySelector(".file")!
fileTabEl = document.querySelector("#file-tabs")!;
menuBarEl = document.querySelector("#menu-bar")!;

registerFileOptionEvent(fileOption);
registerMenuHoverEvent(menuBarEl);
registerTabScrollEvent(fileTabEl);

window.addEventListener("keydown", (event: KeyboardEvent) => {
    textContentEl = document.querySelector("#text-content")!;
    if (event.ctrlKey && event.key.toLowerCase() === "s") {
        console.log("save to file", textContentEl.innerText)
        // call to rust
    }

    if (event.ctrlKey && event.key.toLowerCase() === "o" ) {
        openFile()
    }
})

// const openFileContent = async() => {
//     const selected = await open({
//         multiple: true,
//         defaultPath: '/home/jason/Desktop',
//       }).then(e => {
//         console.log(e)
//       });
// }

// window.addEventListener("keydown", (e) => {
//     if (e.key === "q") {
//         // console.log("q")
//         openFileContent()
//     } 
// })