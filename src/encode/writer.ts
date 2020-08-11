// Copyright (C) 2020 Jan Procházka.
// This code is licensed under the MIT license. (see LICENSE for more details)

import { View } from 'common/view';
import { getType, NUMERIC_LIMITS } from './util';
import { WriteError, ErrorCode } from './error';

const ENCODER = new TextEncoder;
export class Writer {
    private view: View
    private textEncoder: TextEncoder;

    constructor(
        buffer: ArrayBuffer
    ) {
        this.view = new View(buffer);
        this.textEncoder = ENCODER;
    }

    finalize(): ArrayBuffer {
        return this.view.slice(0, this.view.offset);
    }

    write(value: any) {
        switch (getType(value)) {
            case 0: { // undefined
                this.view.setUint8(0xF7);
                break;
            }

            case 1: { // null
                this.view.setUint8(0xF6);
                break;
            }

            case 2: { // boolean
                this.view.setUint8(value ? 0xF5 : 0xF4);
                break;
            }

            case 3: { // number
                if (!Number.isSafeInteger(value)) {
                    // NaN / Infinity / -Infinity are encoded as Float32
                    // TODO: encode Infinity as Float16 instead (less bytes, same value)
                    if (isNaN(value) || !isFinite(value) || (-NUMERIC_LIMITS.FLOAT32 <= value && value <= NUMERIC_LIMITS.FLOAT32)) {
                        this.view.setUint8(0xFA);
                        this.view.setFloat32(value);
                    } else {
                        this.view.setUint8(0xFB);
                        this.view.setFloat64(value);
                    }
                } else {
                    if (value >= 0) {
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
                            this.view.setUint8(0x1A);
                            this.view.setUint32(value);
                        }
                        else {
                            throw WriteError.build(ErrorCode.NUMBER_TOO_LARGE, { number: value.toString(10) })
                            /*
                            this.view.setUint8(0x19);
                            this.view.setUint64(value);
                            */
                        }
                    }
                    else {
                        // The conversions below encode the sign in the first
                        // byte, and the value is converted to a positive number.
                        const positive_number = -1 - value;
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
                            throw WriteError.build(ErrorCode.NUMBER_TOO_LARGE, { number: value.toString(10) })
                            /*
                            this.view.setUint8(0x3B);
                            this.view.setUint64(positive_number as bigint);
                            */
                        }
                    }
                }
                break;
            }

            case 4: { // string
                const encoded = this.textEncoder.encode(value);
                const size = encoded.length;
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
                else {
                    throw WriteError.build(ErrorCode.STRING_TOO_LARGE, { size });
                    /*
                    this.view.setUint8(0x7B);
                    this.view.setUint64(BigInt(size));
                    */
                }

                if (size > 0) {
                    this.view.setBytes(encoded);
                }
                break;
            }

            case 5: { // array
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
                else {
                    throw WriteError.build(ErrorCode.ARRAY_TOO_LARGE, { size });
                    /*
                    this.view.setUint8(0x9B);
                    this.view.setUint64(BigInt(size));
                    */
                }

                for (const item of value) {
                    this.write(item);
                }
                break;
            }

            case 6: { // object
                const size = Object.keys(value).length;
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
                else {
                    throw WriteError.build(ErrorCode.OBJECT_TOO_LARGE, { size });
                    /*
                    this.view.setUint8(0xBB);
                    this.view.setUint64(BigInt(size));
                    */
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