class InlineScriptDslContext extends ScriptDslContext {
    private language: string;
    private lines: string[] = [];

    constructor(parentContext: DslContext, language: string) {
        super(parentContext);
        this.language = language;
    }
}