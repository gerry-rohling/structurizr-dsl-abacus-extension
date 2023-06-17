/* eslint-disable @typescript-eslint/naming-convention */
import { Workspace } from "structurizr-typescript";
import { StructurizrDslTokens } from "./StructurizrDslTokens";

// This class takes a structurizr DSL file and parses it into a workspace object
// There appears to be no TypeScript version of this so I am going to use the Java 
// reference and recode it into TypeScript. I may take some shortcuts initially as things may not translate 1:1
// Reference at: https://github.com/structurizr/dsl/blob/master/src/main/java/com/structurizr/dsl/StructurizrDslParser.java 
// Not sure yet how to keep this in sync with changes to the Java file. TBD
// Getting some help with https://www.codeconvert.ai/java-to-typescript-converter 
export class StructurizrDslParser extends StructurizrDslTokens {

    private static readonly BOM: string = "\uFEFF";
    private static readonly EMPTY_LINE_PATTERN: RegExp = /^\\s*/;
    private static readonly COMMENT_PATTERN: RegExp = /^\\s*?/;
    private static readonly MULTI_LINE_COMMENT_START_TOKEN: string = "";
    private static readonly MULTI_LINE_SEPARATOR: string = "\\";   
    private static readonly STRING_SUBSTITUTION_PATTERN: RegExp = /(\\$\\{[a-zA-Z0-9-_.]+?})/;
    private static readonly STRUCTURIZR_DSL_IDENTIFIER_PROPERTY_NAME: string = "structurizr.dsl.identifier"; 

    private identifierScope: IdentifierScope = IdentifierScope.Flat;
    private contextStack: DslContext[] = [];
    private parsedTokens: Set<string> = new Set();
    private identifiersRegister: IdentifiersRegister;
    private constants: Map<string, Constant>;
    private dslSourceLines: Array<string> = new Array();
    private workspace: Workspace;
    private extendingWorkspace: boolean = false;
    private restricted: boolean = false;

    constructor() {
        super();
        this.contextStack = [];
        this.identifiersRegister = new IdentifiersRegister();
        this.constants = new Map<string, Constant>();
    }

    parse(dslDocument: string) {
        // I think we need to split this doc into a list of strings, one string per line
        // We then need to feed each line into a parser
        throw new Error('Method not implemented.');
    }

    getWorkspace(): Workspace | PromiseLike<Workspace> {
        throw new Error('Method not implemented.');
    }

}