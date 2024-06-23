import { DisplayTracker } from "../menuBarLib";
import { Highlight } from "./editOption";

const viewOptionFunction: {[key: string] : any} = {
    "increase_text": increase_text,
    "decrease_text": decrease_text,
    "highlight": highlight,
    "search": search,
    "word_wrap": word_wrap
}

let fontSize: number = 16
let textContentEl: HTMLDivElement = document.querySelector("#text-content")!;
let whiteSpace = true

export function registerViewOptionEvent(viewOption: HTMLDivElement): void {
    const listOfViewOption = viewOption.children
    for (let i = 0; i < listOfViewOption.length; i++) {
        const optionId = listOfViewOption[i].id;
        const optionEl = document.querySelector(`#${optionId}`);
        if(optionEl) {
            optionEl?.addEventListener("click", (event) => {
                event.preventDefault()
                viewOptionFunction[optionId]()
                if(DisplayTracker.currentDisplayOption) {
                    DisplayTracker.currentDisplayOption.classList.add("hide");
                    DisplayTracker.currentDisplayOption = undefined;
                }
            })
        }
        
    }
}

export function increase_text() {
    fontSize += 4
    textContentEl!.style.fontSize = `${fontSize}px`
}

export function decrease_text() {
    if(fontSize === 16) return
    fontSize -= 4
    textContentEl!.style.fontSize = `${fontSize}px`
}

export function highlight() {
    // fix when revamp
    if(Highlight.highlighted) {
        let text_highlight = document.createElement("span")
        text_highlight.style.display = "inline"
        text_highlight.style.backgroundColor = "yellow"
        text_highlight.innerText = Highlight.copyText

        let textContent = textContentEl.innerText
        let firstContent = textContent.slice(0, Highlight.startOffset)
        let secondContent = textContent.slice(Highlight.endOffset)
        let firstNode = document.createTextNode(firstContent)
        let secondNode = document.createTextNode(secondContent)
        textContentEl.innerHTML = ""
        textContentEl.appendChild(firstNode)
        textContentEl.appendChild(text_highlight)
        textContentEl.appendChild(secondNode)
        Highlight.highlighted = false
    }
}

export function search() {
    // fix when revamp
    console.log("search")
}

export function word_wrap() {
    whiteSpace = !whiteSpace
    
    if (whiteSpace) {
        textContentEl.style.whiteSpace = "pre"
    } else {
        textContentEl.style.whiteSpace = "normal"
    }
}
