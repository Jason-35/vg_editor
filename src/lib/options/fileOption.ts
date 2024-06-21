import { invoke } from "@tauri-apps/api/tauri";
import { open, save } from '@tauri-apps/api/dialog';
import { DisplayTracker } from "../menuBarLib";
import { DisplayTab, changeTabName, registerTabMenuHoverEvent, setCurrentTab } from "../fileTabLib";
import { TextContent } from "../objects/textContent";
import { contentManagement } from "../textLib";
import { appWindow } from '@tauri-apps/api/window';

let newFileTracker = 1;


let fileOptionFunction: {[key: string] : any} = {
    "new_file": newFile,
    "open_file": openFile,
    "save_file": saveFile,
    "save_as_file": saveAsFile,
    "close_file": closeFile,
    "quit": quit
}

export function registerFileOptionEvent(fileOption: HTMLDivElement): void {
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
    const fileTab: HTMLLIElement = document.querySelector("#file-tabs")!;
    let title = "New Document " + newFileTracker.toString()  
    let tabTitle = document.createElement("li");
    tabTitle.id = title;
    tabTitle.innerText = title;
    registerTabMenuHoverEvent(tabTitle);
        tabTitle.addEventListener(("click"), () => {
        setCurrentTab(tabTitle);
    })
    DisplayTab.fileContent[title] = "";
    setCurrentTab(tabTitle);
    let contentObject = new TextContent(title, "");
    contentManagement.contentMap[title] = contentObject;
    fileTab.appendChild(tabTitle);
    newFileTracker += 1
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
        contentManagement.contentMap[title] = contentObject;
        fileTab.appendChild(tabTitle);
    }

}


export async function saveFile() {
    let title = DisplayTab.currentTab!.id;
    let path = contentManagement.contentMap[title].getPath();
    let content = contentManagement.contentMap[title].getCurrentContent()
    console.log(path)
    if(!path) {
        saveAsFile();
    } else {
        await invoke("save_file", { path: path, content: content})
    }
}

export async function saveAsFile() {
    let title = DisplayTab.currentTab!.id;
    let path = contentManagement.contentMap[title].getPath();
    let content = contentManagement.contentMap[title].getCurrentContent()
    const filePath = await save({
        defaultPath: path
    })

    let fileName = filePath?.split("/").pop()!
    contentManagement.contentMap[title].setPath(filePath!);
    contentManagement.contentMap[title].setTitle(fileName);
    changeTabName(fileName)
    contentManagement.contentMap[fileName] = contentManagement.contentMap[title]
    DisplayTab.fileContent[fileName] = content
    delete contentManagement.contentMap[title] 
    delete DisplayTab.fileContent[title]
    await invoke("save_as_file", { path: filePath, content: content})
}

export function closeFile(): void {
    let title = DisplayTab.currentTab!.id;
    let currentTab = document.getElementById(title);
    let content: HTMLDivElement = document.querySelector("#text-content")!

    let tabParent = currentTab!.parentNode!.children!; 
    currentTab!.parentNode!.removeChild(currentTab as Element)
    delete DisplayTab.fileContent[title];
    
    if(tabParent.length > 0) {
        DisplayTab.currentTab = (tabParent[0] as HTMLLIElement);
        content.innerText = DisplayTab.fileContent[tabParent[0].id]
        setCurrentTab(tabParent[0] as HTMLLIElement);
    }else {
        content.innerText = "No File Opened! \n Ctrl + N for new file \n Ctrl + O to open a file"
    }
}

async function quit() {
    await appWindow.close();
    console.log("quit")
}