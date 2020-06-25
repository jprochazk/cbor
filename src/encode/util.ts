// Copyright (C) 2020 Jan Procházka.
// This code is licensed under the MIT license. (see LICENSE for more details)

import { ErrorCode, WriteError } from './error'

export const NUMERIC_LIMITS = {
    UINT8: 2 ** 8 - 1,
    UINT16: 2 ** 16 - 1,
    UINT32: 2 ** 32 - 1,
    UINT64: BigInt("18446744073709552000"),
    FLOAT32: 2 ** 23 - 1,
    FLOAT64: Number.MAX_SAFE_INTEGER
}

export function isFloat(value: any): boolean {
    return typeof value === "number" // must be a number
        && (
            !isFinite(value)    // infinity is always encoded as float32
            || isNaN(value)     // nan is always encoded as float32
            || (value >= NUMERIC_LIMITS.UINT32 || value <= -NUMERIC_LIMITS.UINT32)
        )
}

export function get_type(value: any): "object" | "array" | "string" | "number" | "boolean" | "null" {
    switch (true) {
        case (value === null):
            return "null";
        case (typeof value === "boolean"):
            return "boolean";
        case (typeof value === "number"):
            return "number";
        case (typeof value === "bigint"):
            throw WriteError.build(ErrorCode.UNSUPPORTED_BIGINT);
        case (typeof value === "string"):
            return "string";
        case (Array.isArray(value)):
            return "array";
        case (typeof value === "object"):
            return "object";
        default:
            throw WriteError.build(ErrorCode.UNEXPECTED_TOKEN, { token: value });
    }
}