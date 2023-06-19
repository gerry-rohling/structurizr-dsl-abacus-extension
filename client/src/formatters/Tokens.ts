class Tokens {
    
    private tokens: string[];

    constructor(tokens: string[]) {
        this.tokens = tokens;
    }

    get(index: number) {
        return this.tokens.at(index).trim().replace("\\\\\"", "\"").trim().replace("\\\\n", "\n");
    }

    size() {
        return this.tokens.length;
    }

    contains(token: string) {
        return this.tokens.includes(token.trim());
    }

    withoutContextStartToken() {
        if (this.tokens.at(this.tokens.length-1) === DslContext.CONTEXT_START_TOKEN) {
            return new Tokens(this.tokens.slice(0, -1));
        } else {
            return this;
        }
    }

    includes(index: number){
        return this.tokens.length -1 >= index;
    }

    hasMoreThan(index: number) {
        return this.includes(index + 1);
    }
}