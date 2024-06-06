import { invoke } from "@tauri-apps/api/tauri";

let textContentEl: HTMLDivElement | null;

let testButtonEl: HTMLButtonElement | null;


testButtonEl = document.querySelector("#test")
testButtonEl?.addEventListener("click", () => {
  console.log("clicker")
})

