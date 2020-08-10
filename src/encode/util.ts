// Copyright (C) 2020 Jan Procházka.
// This code is licensed under the MIT license. (see LICENSE for more details)

import { ErrorCode, WriteError } from './error'

export const NUMERIC_LIMITS = {
    UINT8: 2 ** 8 - 1,
    UINT16: 2 ** 16 - 1,
    UINT32: 2 ** 32 - 1,
    //UINT64: BigInt("18446744073709552000"),
    FLOAT32: 2 ** 23 - 1,
    FLOAT64: Number.MAX_SAFE_INTEGER
}

export function getType(value: any): number {
    switch (true) {
        case (typeof value === "undefined"):
            return 0;
        case (value === null):
            return 1;
        case (typeof value === "boolean"):
            return 2;
        case (typeof value === "number"):
            return 3;
        case (typeof value === "bigint"):
            throw WriteError.build(ErrorCode.UNSUPPORTED_BIGINT);
        case (typeof value === "string"):
            return 4;
        case (Array.isArray(value)):
            return 5;
        case (typeof value === "object"):
            return 6;
        default:
            throw WriteError.build(ErrorCode.UNEXPECTED_TOKEN, { token: value });
    }
}