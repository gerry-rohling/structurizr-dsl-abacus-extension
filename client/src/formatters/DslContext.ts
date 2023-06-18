/* eslint-disable @typescript-eslint/naming-convention */
class DslContext {

    static CONTEXT_START_TOKEN: string = '{';
    static CONTEXT_END_TOKEN: string = '}';

    addLine(line: string) {
        throw new Error("Method not implemented.");
    }
    
    end() {
        // Nothing happens
    }
}