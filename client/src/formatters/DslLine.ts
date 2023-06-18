class DslLine {
    private source: string;
    private lineNumber: number;

    constructor(source:string, lineNumber: number) {
        this.source = source;
        this.lineNumber = lineNumber;
    }

    getSource() {
        return this.source;
    }

    getLineNumber() {
        return this.lineNumber;
    }
}