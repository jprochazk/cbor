// Copyright (C) 2020 Jan Procházka.
// This code is licensed under the MIT license. (see LICENSE for more details)

export enum ErrorCode {
    UNEXPECTED_EOF = 0,
    REACHED_MAX_NESTING_DEPTH,
    EMPTY_STACK,
    UNEXPECTED_OBJECT_END,
    UNEXPECTED_ARRAY_END,
    UNSUPPORTED_BYTE_STRING,
    WRONG_STRING_FORMAT,
    UNSUPPORTED_HALF,
    UNEXPECTED_TOKEN,
    UNEXPECTED_VALUE,
    UNSUPPORTED_64_BIT
}

export class ParseError extends Error {
    private constructor(private what: string) {
        super(what);
    }

    public toString() {
        return `ParseError: ${this.what}`;
    }

    public static build(code: ErrorCode, info?: { [index: string]: any }) {
        switch (code) {
            case ErrorCode.UNEXPECTED_EOF:
                return new ParseError(`Unexpected EOF at offset ${(info) ? "" : info!.offset}`);
            case ErrorCode.REACHED_MAX_NESTING_DEPTH:
                return new ParseError(`Max recursion depth reached: ${(info) ? "" : info!.depth}`);
            case ErrorCode.EMPTY_STACK:
                return new ParseError(`Unexpected value before the start of an object or array`);
            case ErrorCode.UNEXPECTED_OBJECT_END:
                return new ParseError(`Unexpected end of object before the start of an object`);
            case ErrorCode.UNEXPECTED_ARRAY_END:
                return new ParseError(`Unexpected end of array before the start of an array`);
            case ErrorCode.UNSUPPORTED_BYTE_STRING:
                return new ParseError(`byte strings are unsupported`);
            case ErrorCode.WRONG_STRING_FORMAT:
                return new ParseError(`Expected string length value range 0x60 to 0x7F, found: ${info!.token}`);
            case ErrorCode.UNSUPPORTED_HALF:
                return new ParseError(`Half (IEEE754 binary16) is unsupported`);
            case ErrorCode.UNEXPECTED_TOKEN:
                return new ParseError(`Unexpected token: ${info!.token}`);
            case ErrorCode.UNEXPECTED_VALUE:
                return new ParseError(`Found value before key in object`);
            case ErrorCode.UNSUPPORTED_64_BIT:
                return new ParseError(`64-bit values are unsupported`);
            default:
                return new ParseError(`Unknown error code`);
        }
    }
}