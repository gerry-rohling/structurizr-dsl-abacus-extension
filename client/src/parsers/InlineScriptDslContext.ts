import { DslContext } from "./DslContext";
import { ScriptDslContext } from "./ScriptDslContext";

export class InlineScriptDslContext extends ScriptDslContext {

    private language: string;
    private lines: string[] = [];

    constructor(parentContext: DslContext, language: string) {
        super(parentContext);
        this.language = language;
    }

    addLine(line: string) {
        throw new Error("Method not implemented.");
    }
}