// Copyright (C) 2020 Jan Procházka.
// This code is licensed under the MIT license. (see LICENSE for more details)

import { Writer } from './writer'

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