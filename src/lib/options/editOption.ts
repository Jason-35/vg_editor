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
let caretIndex: number

const editOptionFunction: {[key: string] : any} = {
    "undo": undo,
    "redo": redo,
    "cut": cut,
    "copy": copy,
    "paste": paste,
}

textContentEl.addEventListener("mouseup", () => {
    if(document.getSelection()?.anchorOffset !== document.getSelection()?.focusOffset){
        highlighted = true
        startOffset = document.getSelection()!.anchorOffset
        endOffset = document.getSelection()!.focusOffset
        startNode = document.getSelection()!.anchorNode
        endNode = document.getSelection()!.focusNode
        copyText = document.getSelection()!.toString()
    } else if (!highlighted && document.activeElement === textContentEl && document.getSelection()?.anchorOffset === document.getSelection()?.focusOffset) {
        highlighted = false
        caretIndex = document.getSelection()!.anchorOffset
    }
    

})

textContentEl.addEventListener("focusout", () => {
    if (highlighted) {
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
    for (let i = 0; i < listOfEditOption.length; i++) {
        const optionId = listOfEditOption[i].id;
        const optionEl = document.querySelector(`#${optionId}`);
        if(optionEl) {
            optionEl?.addEventListener("click", (event) => {
                event.preventDefault()
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
    // TODO: Add to stack
    copy()
    highlighted = false
    let content = textContentEl.innerText
    let editContent = content.replace(copyText, "")
    textContentEl.innerText = editContent 
}

export async function copy() {
    await writeText(copyText)    
    highlighted = false
}

async function paste() {
    // TODO: Add to stack
    const clipboardText = await readText();
    if (highlighted) {
        highlighted = false
        let content = textContentEl.innerText
        let editContent = content.replace(copyText, clipboardText!)
        textContentEl.innerText = editContent 
        // return
    } else {
        let content = textContentEl.innerText
        let firstContent = content.slice(0, caretIndex)
        let pasteContent = clipboardText
        let secondContent = content.slice(caretIndex) 
        let joinContent = firstContent + pasteContent + secondContent
        textContentEl.innerText = joinContent
    }

    let manager = contentManagement.contentMap[DisplayTab.currentTab!.id]
    manager.insertUndo()
    manager.setCurrentContent(textContentEl.innerText);
    DisplayTab.fileContent[DisplayTab.currentTab!.id] = textContentEl.innerText;
    contentManagement.contentMap[DisplayTab.currentTab!.id] = manager;
}



