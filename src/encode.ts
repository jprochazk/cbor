// Copyright (C) 2020 Jan Procházka.
// This code is licensed under the MIT license. (see LICENSE for more details)

import { View } from './view';

/**
 * Encodes a JSON value into CBOR
 * 
 * If `allowErrors` is false (default), the writer will return null 
 * when faced with a write error instead of throwing the error.
 */
export function encode(data: any, allowErrors: boolean, out?: ArrayBuffer) {
    const buffer = out ?? new ArrayBuffer(0);
    if (!allowErrors) {
        try {
            new Writer(buffer).write(data);
        } catch (error) {
            return null;
        }
    } else {
        new Writer(buffer).write(data);
    }
    return buffer;
}

enum ErrorCode {
    UNEXPECTED_TOKEN = 0
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
            default:
                return new WriteError(`Unknown error code`);
        }
    }
}

const NUMERIC_LIMITS = {
    UINT8: 2 ** 8 - 1,
    UINT16: 2 ** 16 - 1,
    UINT32: 2 ** 32 - 1,
    UINT64: BigInt("18446744073709552000"),
    FLOAT32: 2 ** 23 - 1,
    FLOAT64: Number.MAX_SAFE_INTEGER
}

function sub_number_bigint(a: number, b: number | bigint): number | bigint {
    if (typeof b === 'bigint') {
        return BigInt(a) - b;
    } else {
        const result = a - b;
        if (-Number.MAX_SAFE_INTEGER <= result && result <= Number.MAX_SAFE_INTEGER) {
            return result;
        } else if (result === Infinity || result === -Infinity || isNaN(result)) {
            return result;
        }
        else {
            return BigInt(result);
        }
    }
}

function isFloat(value: any): boolean {
    return typeof value === "number" // must be a number
        && (
            !isFinite(value)    // infinity is always encoded as float32
            || isNaN(value)     // nan is always encoded as float32
            || (value >= NUMERIC_LIMITS.UINT32 || value <= -NUMERIC_LIMITS.UINT32)
        )
}

type ValueType = "object" | "array" | "string" | "number" | "boolean" | "null";
function get_type(value: any): ValueType {
    switch (true) {
        case (value === null):
            return "null";
        case (typeof value === "boolean"):
            return "boolean";
        case (typeof value === "number" || typeof value === "bigint"):
            return "number";
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

const TEXT_ENCODER = new TextEncoder();

class Writer {
    private view: View

    constructor(
        buffer: ArrayBuffer
    ) {
        this.view = new View(buffer);
    }

    write(value: any) {
        switch (get_type(value)) {
            case "null": {
                this.view.setUint8(0xF6);
                break;
            }

            case "boolean": {
                this.view.setUint8(value ? 0xF5 : 0xF4);
                break;
            }

            case "number": {
                if (isFloat(value)) {
                    // float
                    // NaN / Infinity / -Infinity are encoded as Float32
                    // TODO: encode as Float16 instead
                    if (isNaN(value) || !isFinite(value) || value <= NUMERIC_LIMITS.FLOAT32) {
                        this.view.setUint8(0xFA);
                        this.view.setFloat32(value);
                    } else {
                        this.view.setUint8(0xFB);
                        this.view.setFloat64(value);
                    }
                } else {
                    // integer
                    if (value >= 0) {
                        // CBOR does not differentiate between positive signed
                        // integers and unsigned integers. Therefore, we used the
                        // code from the value_t::number_unsigned case here.
                        if (value <= 0x17) {
                            this.view.setUint8(value);
                        }
                        else if (value <= NUMERIC_LIMITS.UINT8) {
                            this.view.setUint8(0x18);
                            this.view.setUint8(value);
                        }
                        else if (value <= NUMERIC_LIMITS.UINT16) {
                            this.view.setUint8(0x19);
                            this.view.setUint16(value);
                        }
                        else if (value <= NUMERIC_LIMITS.UINT32) {
                            this.view.setUint8(0x19);
                            this.view.setUint32(value);
                        }
                        else {
                            this.view.setUint8(0x19);
                            this.view.setUint64(value);
                        }
                    }
                    else {
                        // The conversions below encode the sign in the first
                        // byte, and the value is converted to a positive number.
                        const positive_number = sub_number_bigint(-1, value);
                        if (value >= -24) {
                            this.view.setUint8(0b00100000 + (positive_number as number));
                        }
                        else if (positive_number <= NUMERIC_LIMITS.UINT8) {
                            this.view.setUint8(0x38);
                            this.view.setUint8(positive_number as number);
                        }
                        else if (positive_number <= NUMERIC_LIMITS.UINT16) {
                            this.view.setUint8(0x39);
                            this.view.setUint16(positive_number as number);
                        }
                        else if (positive_number <= NUMERIC_LIMITS.UINT32) {
                            this.view.setUint8(0x3A);
                            this.view.setUint32(positive_number as number);
                        }
                        else {
                            this.view.setUint8(0x3B);
                            this.view.setUint64(positive_number as bigint);
                        }
                    }
                }
                break;
            }

            case "string": {
                const size = value.length;
                if (size <= 0x17) {
                    this.view.setUint8(0x60 + size);
                }
                else if (size <= NUMERIC_LIMITS.UINT8) {
                    this.view.setUint8(0x78);
                    this.view.setUint8(size);
                }
                else if (size <= NUMERIC_LIMITS.UINT16) {
                    this.view.setUint8(0x79);
                    this.view.setUint16(size);
                }
                else if (size <= NUMERIC_LIMITS.UINT32) {
                    this.view.setUint8(0x7A);
                    this.view.setUint32(size);
                }
                else if (size <= NUMERIC_LIMITS.UINT64) {
                    this.view.setUint8(0x7B);
                    this.view.setUint64(BigInt(size));
                }
                if (size > 0) {
                    this.view.setBytes(TEXT_ENCODER.encode(value));
                }
                break;
            }

            case "array": {
                const size = value.length;
                if (size <= 0x17) {
                    this.view.setUint8(0x80 + size);
                }
                else if (size <= NUMERIC_LIMITS.UINT8) {
                    this.view.setUint8(0x98);
                    this.view.setUint8(size);
                }
                else if (size <= NUMERIC_LIMITS.UINT16) {
                    this.view.setUint8(0x99);
                    this.view.setUint16(size);
                }
                else if (size <= NUMERIC_LIMITS.UINT32) {
                    this.view.setUint8(0x9A);
                    this.view.setUint32(size);
                }
                else if (size <= NUMERIC_LIMITS.UINT64) {
                    this.view.setUint8(0x9B);
                    this.view.setUint64(BigInt(size));
                }

                for (const item of value) {
                    this.write(item);
                }
                break;
            }

            case "object": {
                const size = value.length;
                if (size <= 0x17) {
                    this.view.setUint8(0xA0 + size);
                }
                else if (size <= NUMERIC_LIMITS.UINT8) {
                    this.view.setUint8(0xB8);
                    this.view.setUint8(size);
                }
                else if (size <= NUMERIC_LIMITS.UINT16) {
                    this.view.setUint8(0xB9);
                    this.view.setUint16(size);
                }
                else if (size <= NUMERIC_LIMITS.UINT32) {
                    this.view.setUint8(0xBA);
                    this.view.setUint32(size);
                }
                else if (size <= NUMERIC_LIMITS.UINT64) {
                    this.view.setUint8(0xBB);
                    this.view.setUint64(BigInt(size));
                }

                for (const [k, v] of Object.entries(value)) {
                    this.write(k);
                    this.write(v);
                }
                break;
            }

            default:
                break;
        }
    }
}