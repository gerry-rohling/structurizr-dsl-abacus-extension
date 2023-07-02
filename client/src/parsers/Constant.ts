export class Constant {
    private name: string;
    private value: string;
    constructor(name: string, value: string) {
        this.name = name;
        this.value = value;
    }
    getName(): string {
        return this.name;
    }
    getValue(): string {
        return this.value;
    }
}