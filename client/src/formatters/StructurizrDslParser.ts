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

    parseDsl(dslDocument: string) {
        if (dslDocument) {
            // I think we need to split this doc into a list of strings, one string per line
            let lines = dslDocument.split(/\r?\n/);
            // We then need to feed each line into a parser
            this.parseLines(lines);
        }
    }

    // Line 187 void parse(List<String> lines, File dslFile) throws StructurizrDslParserException 
    parseLines(lines: string[]) {
        let dslLines = this.preProcessLines(lines);
        for (const dslLine of dslLines){
            let includeInDslSourceLines = true;
            let line = dslLine.getSource();

            if (line.startsWith(StructurizrDslParser.BOM)){
                // This caters for UTF-8 files with BOM
                line = line.substring(1);
            }

            try {
                if (StructurizrDslParser.EMPTY_LINE_PATTERN.test(line)) {
                    // do nothing
                } else if (StructurizrDslParser.COMMENT_PATTERN.test(line)) {
                    // do nothing
                } else if (this.inContext(InlineScriptDslContext)) {
                    if (DslContext.CONTEXT_END_TOKEN === line.trim()){
                        this.endContext();
                    } else {
                        this.getContext(InlineScriptDslContext).addLine(line);
                    }
                } else {
                    let listOfTokens:string[] = new Tokenizer().tokenize(line);
                    
                }
            } catch(e){
                console.log('StructurizrDslParser threw exception: ' + e.message);
            }
        }
    }

    getContext(testContext: any): DslContext {
        if (this.inContext(testContext)) {
            return this.contextStack[this.contextStack.length-1];
        } else {
            throw new Error("Attempted to fetch context of wrong type");
        }
    }

    endContext() {
        if (this.contextStack.length) {
            let context: DslContext = this.contextStack.pop();
            context.end();
        } else {
            throw new Error("Unexpected end of context");
        }
    }

    inContext(testContext: any): boolean {
        if (this.contextStack.length){
            let same = testContext.prototype.isPrototypeOf(this.contextStack[this.contextStack.length - 1]);
            return same;
        } else {
            return false;
        }
    }

    preProcessLines(lines: string[]): DslLine[] {
        let dslLines: DslLine[] = [];
        let lineNumber = 1;
        let buf = '';
        let lineComplete = true;
        for (const line of lines) {
            if (line.endsWith(StructurizrDslParser.MULTI_LINE_SEPARATOR)) {
                buf += line.substring(0, line.length - 1);
                lineComplete = false;
            } else {
                if (lineComplete) {
                    buf += line;
                } else {
                    buf += line.trimStart();
                    lineComplete = true;
                }
            }
            if (lineComplete) {
                dslLines.push(new DslLine(buf, lineNumber));
                buf = '';
            }
            lineNumber++;
        }
        return dslLines;
    }

    getWorkspace(): Workspace | PromiseLike<Workspace> {
        throw new Error('Method not implemented.');
    }

}