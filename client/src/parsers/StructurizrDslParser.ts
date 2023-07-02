/* eslint-disable @typescript-eslint/naming-convention */
import { Workspace } from "structurizr-typescript";
import { Tokens } from "./Tokens";
import { StructurizrDslTokens } from "./StructurizrDslTokens";
import { env } from "process";
import { DslContext } from "./DslContext";
import { InlineScriptDslContext } from "./InlineScriptDslContext";
import { CommentDslContext } from "./CommentDslContext";
import { IdentifierScope } from "./IdentifierScope";
import { Constant } from "./Constant";
import { IdentifiersRegister } from "./IdentifiersRegister";
import { DslLine } from "./DslLine";

// This class takes a structurizr DSL file and parses it into a workspace object
// There appears to be no TypeScript version of this so I am going to use the Java 
// reference and recode it into TypeScript. I may take some shortcuts initially as things may not translate 1:1
// Reference at: https://github.com/structurizr/dsl/blob/master/src/main/java/com/structurizr/dsl/StructurizrDslParser.java 
// Not sure yet how to keep this in sync with changes to the Java file. TBD
// Getting some help with https://www.codeconvert.ai/java-to-typescript-converter 
export class StructurizrDslParser extends StructurizrDslTokens {

    private static readonly BOM: string = "\uFEFF";
    private static readonly EMPTY_LINE_PATTERN: RegExp = /^\\s*/;
    private static readonly COMMENT_PATTERN: RegExp = /^\s*?(.*)$/;
    private static readonly MULTI_LINE_COMMENT_START_TOKEN: string = "/*";
    private static readonly MULTI_LINE_COMMENT_END_TOKEN: string = "*/";
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
                        (this.getContext(InlineScriptDslContext) as InlineScriptDslContext).addLine(line);
                    }
                } else {
                    let listOfTokens:string[] = new Tokenizer().tokenize(line);
                    let substitutedTokens: string[] = listOfTokens.map(this.substituteStrings);

                    let tokens: Tokens = new Tokens(substitutedTokens);

                    let identifier: string = null;

                    if ( tokens.size() > 3 && this.ASSIGNMENT_OPERATOR_TOKEN === tokens.get(1) ) {
                        identifier = tokens.get(0);
                        this.identifiersRegister.validateIdentifierName(identifier);
                        tokens = new Tokens(listOfTokens.slice(2));
                    }

                    let firstToken: string = tokens.get(0);

                    if (line.trim().startsWith(StructurizrDslParser.MULTI_LINE_COMMENT_START_TOKEN)
                        && line.trim().endsWith(StructurizrDslParser.MULTI_LINE_COMMENT_END_TOKEN)) {
                            // do nothing
                    } else if (firstToken.startsWith(StructurizrDslParser.MULTI_LINE_COMMENT_START_TOKEN)) {
                        this.startContext(new CommentDslContext());
                    }
                }
            } catch(e){
                console.log('StructurizrDslParser threw exception: ' + e.message);
            }
        }
    }

    startContext(context: any) {
        context.setWorkspace(this.workspace);
        context.setIdentifierRegister(this.identifiersRegister);
        context.setExtendingWorkspace(this.extendingWorkspace);
        this.contextStack.push(context);
    }

    substituteStrings(token: string): string {
        let before: string = null;
        let after: string = null;
        const matches = token.matchAll(StructurizrDslParser.STRING_SUBSTITUTION_PATTERN);
        for (const match of matches) {
            console.log(match);
            before = '';
            after = null;
            let name: string = before.substring(2, before.length-1);
            if (this.constants.has(name)) {
                after = this.constants.get(name).getValue();
            } else {
                if (!this.restricted) {
                    let environmentVariable: string = env[name];
                    if (environmentVariable) {
                        after = environmentVariable;
                    }
                }
            }
        }

        if (after) {
            token = token.replace(before, after);
        }

        return token;
    }

    getContext(testContext: any): any {
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