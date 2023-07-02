/* eslint-disable @typescript-eslint/naming-convention */
export class IdentifiersRegister {
    private static readonly IDENTIFIER_PATTERN: RegExp = /\\w+/;

    validateIdentifierName(identifier: string) {
        if (!IdentifiersRegister.IDENTIFIER_PATTERN.test(identifier)) {
            throw new Error("Identifiers can only contain the following characters: a-zA-Z_0-9");
        }
    }
    
}