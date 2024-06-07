let currentDisplayOption: HTMLDivElement | undefined;

/**
 * registers event listeners to items in the navigation menu
 * @param menuBarEl list of li elements to give event listeners
 */
export function registerMenuHoverEvent(menuBarEl: HTMLUListElement) {
    const menuChildren = menuBarEl.children;
    let element: HTMLLIElement | null;
    for (let i = 0; i < menuChildren.length; i++) {
        const elementId = menuChildren[i].id;
        element = document.querySelector(`#${elementId}`)!;

        let optionDisplay = document.getElementsByClassName(elementId)[0];
        
        if (element) {
            console.log(element)
            element.addEventListener("click", () => {
                setDisplayOption(optionDisplay as HTMLDivElement);
            });
        }
    }
}

/**
 * 
 * @param optionDisplay div element that is to be displayed to user
 * @param displayNone optional to clear all display
 * @returns none
 */
export function setDisplayOption(optionDisplay: HTMLDivElement, displayNone?: boolean){
    if (displayNone) {
        if (currentDisplayOption) {
            currentDisplayOption.classList.add("hide");
        }
        currentDisplayOption = undefined;
        return;
    }

    if (currentDisplayOption === optionDisplay) {
        currentDisplayOption.classList.add("hide");
        currentDisplayOption = undefined;
        return;
    }

    if (currentDisplayOption === undefined) {
        currentDisplayOption = optionDisplay;
        currentDisplayOption.classList.remove("hide");
        return;
    }

    if (currentDisplayOption !== undefined) {
        currentDisplayOption.classList.add("hide");
        currentDisplayOption = optionDisplay;
        currentDisplayOption.classList.remove("hide");
        return;
    }
}
