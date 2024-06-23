export class DisplayTab {
    public static currentTab: HTMLLIElement | undefined;
    public static fileContent: {[key: string] : any} = {};
}

export function registerTabMenuHoverEvent(tabEl: HTMLLIElement) {
    tabEl.addEventListener(("mouseover"), () => {
        if (tabEl !== DisplayTab.currentTab) {
            // tabEl.style.backgroundColor = "aqua"
            tabEl.style.color = "#ffffff"
        }
    })
    
    tabEl.addEventListener(("mouseout"), () => {
        if (tabEl !== DisplayTab.currentTab) {
            tabEl.style.backgroundColor = "hsla(257, 11%, 12%, 0.5)"
            tabEl.style.color = "grey"
        }
    })
}

export function registerTabScrollEvent(fileTabEl: HTMLUListElement) {
    fileTabEl.addEventListener("wheel", (event) => {
        if (event.deltaY < 0) {
            fileTabEl.scrollLeft -= 50
        } else {
            fileTabEl.scrollLeft += 50
        }
    }, { passive: true })

    let listOfTabs = fileTabEl.children

    for (let i = 0; i < listOfTabs.length; i++) {
        const tabElementId = listOfTabs[i].id
        let tabEl = document.querySelector(`#${tabElementId}`);

        if (tabEl) {
            
            tabEl.addEventListener(("click"), () => {
                setCurrentTab(tabEl as HTMLLIElement);
            })

            registerTabMenuHoverEvent(tabEl as HTMLLIElement)
        }

    }
}

export function setCurrentTab(tabEl: HTMLLIElement) {
    const textContent: HTMLDivElement = document.querySelector("#text-content")!;
    if (DisplayTab.currentTab === undefined) {
        DisplayTab.currentTab = tabEl;
        DisplayTab.currentTab.style.background = "hsla(257, 11%, 12%, 0.8)";
        DisplayTab.currentTab.style.color = "white";
        textContent.innerText = DisplayTab.fileContent[tabEl.id];
        return
    }

    if (DisplayTab.currentTab !== undefined) {
        console.log("click")
        DisplayTab.currentTab.style.background = "hsla(257, 11%, 12%, 0.5)";
        DisplayTab.currentTab.style.color = "grey"
        DisplayTab.currentTab = tabEl;
        DisplayTab.currentTab.style.background = "hsla(257, 11%, 12%, 0.8)";
        DisplayTab.currentTab.style.color = "#ffffff"
        textContent.innerText = DisplayTab.fileContent[tabEl.id];
        return
    }
}

export function changeTabName(name: string) {
    let currentTab = DisplayTab.currentTab!;
    currentTab!.id = name
    currentTab.innerText = name
    DisplayTab.fileContent[name] = DisplayTab.fileContent[currentTab!.id]
}
