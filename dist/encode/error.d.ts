export declare enum ErrorCode {
    UNEXPECTED_TOKEN = 0,
    UNSUPPORTED_BIGINT = 1,
    STRING_TOO_LARGE = 2,
    ARRAY_TOO_LARGE = 3,
    OBJECT_TOO_LARGE = 4,
    NUMBER_TOO_LARGE = 5
}
export declare class WriteError extends Error {
    private what;
    private constructor();
    toString(): string;
    static build(code: ErrorCode, info?: {
        [index: string]: any;
    }): WriteError;
}
