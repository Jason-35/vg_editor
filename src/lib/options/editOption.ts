import { DisplayTab } from "../fileTabLib"
import { DisplayTracker } from "../menuBarLib";
import { contentManagement } from "../textLib"
import { readText, writeText } from '@tauri-apps/api/clipboard';

let textContentEl: HTMLDivElement = document.querySelector("#text-content")!;
let startNode;
let endNode;
// export let startOffset: number
// export let endOffset: number
// export let copyText: string

export class Highlight {
     public static highlighted = false
     public static startOffset: number
     public static endOffset: number
     public static copyText: string
}

let caretIndex: number

const editOptionFunction: {[key: string] : any} = {
    "undo": undo,
    "redo": redo,
    "cut": cut,
    "copy": copy,
    "paste": paste,
}

textContentEl.addEventListener("mouseup", () => {
    console.log(document.getSelection()?.toString(), document.getSelection())
    if(document.getSelection()?.anchorOffset !== document.getSelection()?.focusOffset){
        Highlight.highlighted = true
        Highlight.startOffset = document.getSelection()!.anchorOffset
        Highlight.endOffset = document.getSelection()!.focusOffset
        startNode = document.getSelection()!.anchorNode
        endNode = document.getSelection()!.focusNode
        Highlight.copyText = document.getSelection()!.toString()
    } else if (!Highlight.highlighted && document.activeElement === textContentEl && document.getSelection()?.anchorOffset === document.getSelection()?.focusOffset) {
        Highlight.highlighted = false
        caretIndex = document.getSelection()!.anchorOffset
    }
    

})

textContentEl.addEventListener("focusout", () => {
    if (Highlight.highlighted) {
        let range = document.createRange();
        range.setStart(startNode!, Highlight.startOffset);
        range.setEnd(endNode!, Highlight.endOffset);
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
    copy()
    Highlight.highlighted = false
    let content = textContentEl.innerText
    let editContent = content.replace(Highlight.copyText, "")
    textContentEl.innerText = editContent 
    let manager = contentManagement.contentMap[DisplayTab.currentTab!.id]
    manager.insertUndo()
    manager.setCurrentContent(textContentEl.innerText);
    DisplayTab.fileContent[DisplayTab.currentTab!.id] = textContentEl.innerText;
    contentManagement.contentMap[DisplayTab.currentTab!.id] = manager;
}

export async function copy() {
    await writeText(Highlight.copyText)    
    Highlight.highlighted = false
}

async function paste() {
    const clipboardText = await readText();
    if (Highlight.highlighted) {
        Highlight.highlighted = false
        let content = textContentEl.innerText
        let editContent = content.replace(Highlight.copyText, clipboardText!)
        textContentEl.innerText = editContent 
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



