/* eslint-disable @typescript-eslint/naming-convention */
class ScriptDslContext extends DslContext {
    private static readonly WORKSPACE_VARIABLE_NAME: string = "workspace";
    private static readonly VIEW_VARIABLE_NAME: string = "view";
    private static readonly ELEMENT_VARIABLE_NAME: string = "element";
    private static readonly RELATIONSHIP_VARIABLE_NAME: string = "relationship";

    private parentContext: DslContext;

    constructor(parentContext: DslContext) {
        super();
        this.parentContext = parentContext;
    }

    run(context: DslContext, extension: string, lines: string[]) {
        let script:string;
        for (const line of lines) {
            script += line;
            script += '\n';
        }
        throw new Error('Method not implemented.');
    }
}