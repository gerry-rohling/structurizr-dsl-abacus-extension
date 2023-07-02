import { Workspace } from "structurizr-typescript";

/* eslint-disable @typescript-eslint/naming-convention */
export class DslContext {

    static CONTEXT_START_TOKEN: string = '{';
    static CONTEXT_END_TOKEN: string = '}';

    private workspace: Workspace;
    private extendingWorkspace: boolean;

    private identifiersRegister: IdentifiersRegister = new IdentifiersRegister();

    getWorkspace() : Workspace {
        return this.workspace;
    }

    setWorkspace(workspace: Workspace) {
        this.workspace = workspace;
    }

    isExtendingWorkspace(): boolean {
        return this.extendingWorkspace;
    }

    setExtendingWorkspace(extendingWorkspace: boolean) {
        this.extendingWorkspace = extendingWorkspace;
    }
  
    end() {
        // Nothing happens
    }
}