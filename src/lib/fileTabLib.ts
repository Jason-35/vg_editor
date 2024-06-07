let currentTab: HTMLLIElement | undefined;

function registerTabMenuHoverEvent(tabEl: HTMLLIElement) {
    tabEl.addEventListener(("mouseover"), () => {
        if (tabEl !== currentTab) {
            tabEl.style.backgroundColor = "aqua"
        }
    })
    
    tabEl.addEventListener(("mouseout"), () => {
        if (tabEl !== currentTab) {
            tabEl.style.backgroundColor = "white"
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

    if (currentTab === undefined) {
        currentTab = tabEl;
        currentTab.style.background = "yellow";
        return
    }

    if (currentTab !== undefined) {
        currentTab.style.background = "white";
        currentTab = tabEl;
        currentTab.style.background = "yellow";
    }
}
