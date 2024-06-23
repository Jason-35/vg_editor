import { DisplayTracker } from "../menuBarLib";

const viewOptionFunction: {[key: string] : any} = {
    "increase_text": increase_text,
    "decrease_text": decrease_text,
    "highlight": highlight,
    "search": search,
}

let fontSize: number = 16
let textContentEl: HTMLDivElement = document.querySelector("#text-content")!;

export function registerViewOptionEvent(viewOption: HTMLDivElement): void {
    const listOfViewOption = viewOption.children
    console.log(listOfViewOption)
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
    console.log("highlight")
}

export function search() {
    console.log("search")
}

export function word_wrap() {
    console.log("add word wrap")
}

