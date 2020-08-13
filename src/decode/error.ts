// Copyright (C) 2020 Jan Procházka.
// This code is licensed under the MIT license. (see LICENSE for more details)

export enum ErrorCode {
    REACHED_MAX_NESTING_DEPTH = 0,
    EMPTY_STACK,
    UNEXPECTED_OBJECT_END,
    UNEXPECTED_ARRAY_END,
    UNSUPPORTED_BYTE_STRING,
    UNSUPPORTED_HALF,
    UNEXPECTED_VALUE,
    UNSUPPORTED_64_BIT
}

export class ParseError extends Error {
    private constructor(what: string) {
        super(what);
    }

    public static build(code: ErrorCode, info?: { [index: string]: any }) {
        switch (code) {
            /* istanbul ignore next */
            case ErrorCode.REACHED_MAX_NESTING_DEPTH:
                return new ParseError(`Max recursion depth reached: ${(info) ? "" : info!.depth}`);
            /* istanbul ignore next */
            case ErrorCode.EMPTY_STACK:
                return new ParseError(`Unexpected key/value before the start of an object or array`);
            /* istanbul ignore next */
            case ErrorCode.UNEXPECTED_OBJECT_END:
                return new ParseError(`Unexpected end of object before the start of an object`);
            /* istanbul ignore next */
            case ErrorCode.UNEXPECTED_ARRAY_END:
                return new ParseError(`Unexpected end of array before the start of an array`);
            case ErrorCode.UNSUPPORTED_BYTE_STRING:
                return new ParseError(`byte strings are unsupported`);
            case ErrorCode.UNSUPPORTED_HALF:
                return new ParseError(`Half (IEEE754 binary16) is unsupported`);
            /* istanbul ignore next */
            case ErrorCode.UNEXPECTED_VALUE:
                return new ParseError(`Found value before key in object`);
            case ErrorCode.UNSUPPORTED_64_BIT:
                return new ParseError(`64-bit values are unsupported`);
            default:
                // this can only happen if you're not using typescript
                /* istanbul ignore next */
                return new ParseError(`Unknown error code`);
        }
    }
}