export declare enum ErrorCode {
    UNEXPECTED_EOF = 0,
    REACHED_MAX_NESTING_DEPTH = 1,
    EMPTY_STACK = 2,
    UNEXPECTED_OBJECT_END = 3,
    UNEXPECTED_ARRAY_END = 4,
    UNSUPPORTED_BYTE_STRING = 5,
    WRONG_STRING_FORMAT = 6,
    UNSUPPORTED_HALF = 7,
    UNEXPECTED_TOKEN = 8,
    UNEXPECTED_VALUE = 9,
    UNSUPPORTED_64_BIT = 10
}
export declare class ParseError extends Error {
    private what;
    private constructor();
    toString(): string;
    static build(code: ErrorCode, info?: {
        [index: string]: any;
    }): ParseError;
}
