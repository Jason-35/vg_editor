import { DisplayTab } from "../fileTabLib"
import { DisplayTracker } from "../menuBarLib";
import { contentManagement } from "../textLib"
import { readText, writeText } from '@tauri-apps/api/clipboard';

let textContentEl: HTMLDivElement = document.querySelector("#text-content")!;
let highlighted = false
let startNode;
let endNode;
let startOffset: number
let endOffset: number
let copyText: string

const editOptionFunction: {[key: string] : any} = {
    "undo": undo,
    "redo": redo,
    "cut": cut,
    "copy": copy,
    "paste": paste,
}

document.addEventListener("mouseup", () => {
    if(document.getSelection()?.anchorOffset !== document.getSelection()?.focusOffset){
        highlighted = true
        startOffset = document.getSelection()!.anchorOffset
        endOffset = document.getSelection()!.focusOffset
        startNode = document.getSelection()!.anchorNode
        endNode = document.getSelection()!.focusNode
        copyText = document.getSelection()!.toString()

    }
})

textContentEl.addEventListener("focusout", () => {
    if (highlighted) {
        highlighted = false
        console.log("HIGHLIGHTED!")
        let range = document.createRange();
        range.setStart(startNode!, startOffset);
        range.setEnd(endNode!, endOffset);
        let sel = window.getSelection()!;
        sel.removeAllRanges();
        sel.addRange(range);
    }
})

export function registerEditOptionEvent(editOption: HTMLDivElement): void {
    const listOfEditOption = editOption.children
    console.log(listOfEditOption)
    for (let i = 0; i < listOfEditOption.length; i++) {
        const optionId = listOfEditOption[i].id;
        const optionEl = document.querySelector(`#${optionId}`);
        if(optionEl) {
            optionEl?.addEventListener("click", () => {
                editOptionFunction[optionId]()
                if(DisplayTracker.currentDisplayOption) {
                    DisplayTracker.currentDisplayOption.classList.add("hide");
                    DisplayTracker.currentDisplayOption = undefined;
                }
            })
        }
        
    }
}

export function undo() {
    let textContentEl: HTMLDivElement = document.querySelector("#text-content")!;
    let title = DisplayTab.currentTab!.id
    let manage = contentManagement.contentMap[title]
    if(!manage.undoIsEmpty()) {
        let undoContent = manage.undo()!
        manage.insertRedo()
        manage.setCurrentContent(undoContent);
        textContentEl!.innerText = undoContent;
    }
}

export function redo() {
    let textContentEl: HTMLDivElement = document.querySelector("#text-content")!;
    let title = DisplayTab.currentTab!.id
    let manage = contentManagement.contentMap[title]
    if(!manage.redoIsEmpty()) {
        let redoContent = manage.redo()!
        manage.insertUndo()
        manage.setCurrentContent(redoContent)
        textContentEl!.innerText = redoContent;
    }
}

function cut() {
    console.log("cut")
}

export async function copy() {
    await writeText(copyText)    
}

async function paste() {
    const clipboardText = await readText();
    let content = textContentEl.innerText
    let editContent = content.replace(copyText, clipboardText!)
    textContentEl.innerText = editContent 
}



