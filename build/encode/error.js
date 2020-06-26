// Copyright (C) 2020 Jan Procházka.
// This code is licensed under the MIT license. (see LICENSE for more details)
import { NUMERIC_LIMITS } from "./util";
export var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["UNEXPECTED_TOKEN"] = 0] = "UNEXPECTED_TOKEN";
    ErrorCode[ErrorCode["UNSUPPORTED_BIGINT"] = 1] = "UNSUPPORTED_BIGINT";
    ErrorCode[ErrorCode["STRING_TOO_LARGE"] = 2] = "STRING_TOO_LARGE";
    ErrorCode[ErrorCode["ARRAY_TOO_LARGE"] = 3] = "ARRAY_TOO_LARGE";
    ErrorCode[ErrorCode["OBJECT_TOO_LARGE"] = 4] = "OBJECT_TOO_LARGE";
    ErrorCode[ErrorCode["NUMBER_TOO_LARGE"] = 5] = "NUMBER_TOO_LARGE";
})(ErrorCode || (ErrorCode = {}));
export class WriteError extends Error {
    constructor(what) {
        super(what);
        this.what = what;
    }
    toString() {
        return `ParseError: ${this.what}`;
    }
    static build(code, info) {
        switch (code) {
            case ErrorCode.UNEXPECTED_TOKEN:
                return new WriteError(`Unexpected token: ${info.token.toString()}`);
            case ErrorCode.UNSUPPORTED_BIGINT:
                return new WriteError(`BigInt is unsupported`);
            case ErrorCode.STRING_TOO_LARGE:
                return new WriteError(`Max String length is ${NUMERIC_LIMITS.UINT32}, found: ${info.size}`);
            case ErrorCode.ARRAY_TOO_LARGE:
                return new WriteError(`Max Array length is ${NUMERIC_LIMITS.UINT32}, found: ${info.size}`);
            case ErrorCode.OBJECT_TOO_LARGE:
                return new WriteError(`Max Object length is ${NUMERIC_LIMITS.UINT32}, found: ${info.size}`);
            case ErrorCode.NUMBER_TOO_LARGE:
                return new WriteError(`Max Number is ${Number.MAX_SAFE_INTEGER}, found: ${info.number}`);
            default:
                return new WriteError(`Unknown error code`);
        }
    }
}
