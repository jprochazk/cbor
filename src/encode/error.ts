// Copyright (C) 2020 Jan Procházka.
// This code is licensed under the MIT license. (see LICENSE for more details)

export enum ErrorCode {
    UNEXPECTED_TOKEN = 0,
    UNSUPPORTED_BIGINT,
    STRING_TOO_LARGE,
    ARRAY_TOO_LARGE,
    OBJECT_TOO_LARGE,
    NUMBER_TOO_LARGE
}

export class WriteError extends Error {
    private constructor(private what: string) {
        super(what);

    }

    public toString() {
        return `ParseError: ${this.what}`;
    }

    public static build(code: ErrorCode, info?: { [index: string]: any }) {
        switch (code) {
            case ErrorCode.UNEXPECTED_TOKEN:
                return new WriteError(`Unexpected token: ${info!.token.toString()}`);
            case ErrorCode.UNSUPPORTED_BIGINT:
                return new WriteError(`BigInt is unsupported`);
            case ErrorCode.STRING_TOO_LARGE:
                return new WriteError(`Max String length is 4294967295, found: ${info!.size}`)
            case ErrorCode.ARRAY_TOO_LARGE:
                return new WriteError(`Max Array length is 4294967295, found: ${info!.size}`)
            case ErrorCode.OBJECT_TOO_LARGE:
                return new WriteError(`Max Object length is 4294967295, found: ${info!.size}`)
            case ErrorCode.NUMBER_TOO_LARGE:
                return new WriteError(`Max Number is ${Number.MAX_SAFE_INTEGER}, found: ${info!.number}`)
            default:
                return new WriteError(`Unknown error code`);
        }
    }
}