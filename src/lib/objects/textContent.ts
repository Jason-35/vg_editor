export class TextContent {
    title: string;
    content: string;
    undoStack: string[];
    redoStack: string[];
    path: string;


    constructor(title: string, content: string) {
        this.title = title;
        this.content = content
        this.undoStack = [];
        this.redoStack = []
        this.path = ""
    }

    setTitle(title: string) {
        this.title = title;
    }

    setPath(path: string) {
        this.path = path;
    }

    getPath() {
        return this.path;
    }

    undoIsEmpty() {
        return this.undoStack.length === 0
    }

    redoIsEmpty() {
        return this.redoStack.length === 0
    }

    undo() {
        return this.undoStack.pop();
    }

    redo() {
        return this.redoStack.pop();
    }

    insertUndo() {
        this.undoStack.push(this.content);
    }

    insertRedo() {
        this.redoStack.push(this.content);
    }

    setCurrentContent(content: string) {
        this.content = content;
    }

    getCurrentContent() {
        return this.content;
    }


}