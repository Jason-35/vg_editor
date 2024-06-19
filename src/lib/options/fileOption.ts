import { invoke } from "@tauri-apps/api/tauri";
import { open, save } from '@tauri-apps/api/dialog';
import { DisplayTracker } from "../menuBarLib";
import { DisplayTab, registerTabMenuHoverEvent, setCurrentTab } from "../fileTabLib";
import { TextContent } from "../objects/textContent";
import { contentManagement } from "../textLib";

let fileOptionFunction: {[key: string] : any} = {
    "new_file": newFile,
    "open_file": openFile,
    "save_file": saveFile,
    "save_as_file": saveAsFile,
    "close_file": closeFile,
    "quit": quit
}

export function registerFileOptionEvent(fileOption: HTMLDivElement): void {
    console.log(fileOption.children)
    const listOfFileOption = fileOption.children

    for (let i = 0; i < listOfFileOption.length; i++) {
        const optionId = listOfFileOption[i].id;

        const optionEl = document.querySelector(`#${optionId}`);
        if(optionEl) {
            optionEl?.addEventListener("click", () => {
                fileOptionFunction[optionId]()
                if(DisplayTracker.currentDisplayOption) {
                    DisplayTracker.currentDisplayOption.classList.add("hide");
                    DisplayTracker.currentDisplayOption = undefined;
                }
            })
        }
        
    }
}

function getDocTitle(path: string): string {
    let pathSplit = path.split("/");
    if(!pathSplit) {
        return "";
    }
    const title = pathSplit.pop()!
    return title;
}

export function newFile() {
    console.log("new file")
}

export async function openFile() {
    const selected = await open();
    const textContent: HTMLDivElement = document.querySelector("#text-content")!;
    const fileTab: HTMLLIElement = document.querySelector("#file-tabs")!;
    if (selected) {
        let result: string[] = await invoke("open_file", { path: selected})
        const content = result[0]
        const path = result[1]
        textContent.innerText = content;
        let tabTitle = document.createElement("li");
        const title = getDocTitle(path);
        tabTitle.id = title;
        tabTitle.innerText = title;
        registerTabMenuHoverEvent(tabTitle);
        tabTitle.addEventListener(("click"), () => {
            setCurrentTab(tabTitle);
        })
        DisplayTab.fileContent[title] = content;
        setCurrentTab(tabTitle)
        let contentObject = new TextContent(title, content);
        contentObject.setPath(path);
        console.log(path);
        contentManagement.contentMap[title] = contentObject;
        fileTab.appendChild(tabTitle);
    }

}


export async function saveFile() {
    let title = DisplayTab.currentTab!.id;
    let path = contentManagement.contentMap[title].getPath();
    let content = contentManagement.contentMap[title].getCurrentContent()
    await invoke("save_file", { path: path, content: content})
}

export async function saveAsFile() {
    let title = DisplayTab.currentTab!.id;
    let path = contentManagement.contentMap[title].getPath();
    let content = contentManagement.contentMap[title].getCurrentContent()
    const filePath = await save({
        defaultPath: path
    })
    contentManagement.contentMap[title].setPath(filePath!);
    await invoke("save_as_file", { path: filePath, content: content})
}

function closeFile(): void {
    console.log("close file")
}

function quit(): void {
    console.log("quit")
}