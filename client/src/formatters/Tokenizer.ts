class Tokenizer {

    private static readonly WHITESPACE: RegExp = /\s/;

    tokenize(line: string) : string[] {
        let tokens: string[] = [];

        line = line.trim();
        let tokenStarted = false;
        let quoted = false;
        let token: string;

        for (const c of line){
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

            }
        }

        return tokens;
    }
}