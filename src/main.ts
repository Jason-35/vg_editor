import { invoke } from "@tauri-apps/api/tauri";
import { registerMenuHoverEvent } from "./lib/menuBarLib";

let menuBarEl: HTMLUListElement | null
menuBarEl = document.querySelector("#menu-bar")
registerMenuHoverEvent(menuBarEl!)