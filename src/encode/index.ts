// Copyright (C) 2020 Jan Procházka.
// This code is licensed under the MIT license. (see LICENSE for more details)

import { Writer } from "encode/writer"

/**
 * Encodes a JSON value into CBOR
 * 
 * If `allowErrors` is false (default), the writer will return null 
 * when faced with a write error instead of throwing the error.
 */
export function encode(data: any, allowErrors: boolean, out?: ArrayBuffer) {
    const buffer = out || new ArrayBuffer(1024);
    const writer = new Writer(buffer);
    if (!allowErrors) {
        try {
            writer.write(data);
        } catch (error) {
            return null;
        }
    } else {
        writer.write(data);
    }
    return writer.finalize();
}