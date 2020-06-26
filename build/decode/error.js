// Copyright (C) 2020 Jan Procházka.
// This code is licensed under the MIT license. (see LICENSE for more details)
export var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["UNEXPECTED_EOF"] = 0] = "UNEXPECTED_EOF";
    ErrorCode[ErrorCode["REACHED_MAX_NESTING_DEPTH"] = 1] = "REACHED_MAX_NESTING_DEPTH";
    ErrorCode[ErrorCode["EMPTY_STACK"] = 2] = "EMPTY_STACK";
    ErrorCode[ErrorCode["UNEXPECTED_OBJECT_END"] = 3] = "UNEXPECTED_OBJECT_END";
    ErrorCode[ErrorCode["UNEXPECTED_ARRAY_END"] = 4] = "UNEXPECTED_ARRAY_END";
    ErrorCode[ErrorCode["UNSUPPORTED_BYTE_STRING"] = 5] = "UNSUPPORTED_BYTE_STRING";
    ErrorCode[ErrorCode["WRONG_STRING_FORMAT"] = 6] = "WRONG_STRING_FORMAT";
    ErrorCode[ErrorCode["UNSUPPORTED_HALF"] = 7] = "UNSUPPORTED_HALF";
    ErrorCode[ErrorCode["UNEXPECTED_TOKEN"] = 8] = "UNEXPECTED_TOKEN";
    ErrorCode[ErrorCode["UNEXPECTED_VALUE"] = 9] = "UNEXPECTED_VALUE";
    ErrorCode[ErrorCode["UNSUPPORTED_64_BIT"] = 10] = "UNSUPPORTED_64_BIT";
})(ErrorCode || (ErrorCode = {}));
export class ParseError extends Error {
    constructor(what) {
        super(what);
        this.what = what;
    }
    toString() {
        return `ParseError: ${this.what}`;
    }
    static build(code, info) {
        switch (code) {
            case ErrorCode.UNEXPECTED_EOF:
                return new ParseError(`Unexpected EOF at offset ${(info) ? "" : info.offset}`);
            case ErrorCode.REACHED_MAX_NESTING_DEPTH:
                return new ParseError(`Max recursion depth reached: ${(info) ? "" : info.depth}`);
            case ErrorCode.EMPTY_STACK:
                return new ParseError(`Unexpected value before the start of an object or array`);
            case ErrorCode.UNEXPECTED_OBJECT_END:
                return new ParseError(`Unexpected end of object before the start of an object`);
            case ErrorCode.UNEXPECTED_ARRAY_END:
                return new ParseError(`Unexpected end of array before the start of an array`);
            case ErrorCode.UNSUPPORTED_BYTE_STRING:
                return new ParseError(`byte strings are unsupported`);
            case ErrorCode.WRONG_STRING_FORMAT:
                return new ParseError(`Expected string length value range 0x60 to 0x7F, found: ${info.token}`);
            case ErrorCode.UNSUPPORTED_HALF:
                return new ParseError(`Half (IEEE754 binary16) is unsupported`);
            case ErrorCode.UNEXPECTED_TOKEN:
                return new ParseError(`Unexpected token: ${info.token}`);
            case ErrorCode.UNEXPECTED_VALUE:
                return new ParseError(`Found value before key in object`);
            case ErrorCode.UNSUPPORTED_64_BIT:
                return new ParseError(`64-bit values are unsupported`);
            default:
                return new ParseError(`Unknown error code`);
        }
    }
}
