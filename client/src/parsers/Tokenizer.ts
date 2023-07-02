/* eslint-disable @typescript-eslint/naming-convention */
class Tokenizer {

    private static readonly WHITESPACE: RegExp = /\s/;

    tokenize(line: string) : string[] {
        let tokens: string[] = [];

        line = line.trim();
        let tokenStarted = false;
        let quoted = false;
        let token: string;

        for (let i=0; i < line.length; i++){
            let c = line.charAt(i);
            if (!tokenStarted){
                if (c === '"'){
                    quoted = true;
                    tokenStarted = true;
                    token = '';
                } else if (Tokenizer.WHITESPACE.test(c)) {
                    // skip
                } else {
                    quoted = false;
                    tokenStarted = true;
                    token = '';
                    token += c;
                }
            } else {
                if(c === '"' && line.charAt(i-1) === '\\') {
                    // escaped quote
                    token += c;
                } else if (quoted && c === '"') {
                    // this is the end of the token
                    tokens.push(token);
                    tokenStarted = false;
                    quoted = false;
                } else if (!quoted && Tokenizer.WHITESPACE.test(c)) {
                    tokens.push(token);
                    tokenStarted = false;
                    quoted = false;
                } else {
                    token += c;
                }
            }
        }

        if (tokenStarted) {
            tokens.push(token);
        }

        return tokens;
    }
}