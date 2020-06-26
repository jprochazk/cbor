// Copyright (C) 2020 Jan Procházka. 
// This code is licensed under the MIT license. (see LICENSE for more details)
import { decode } from './decode'
import { encode } from './encode'

export class CBOR {

    /**
     * Decodes a CBOR object into JSON
     * 
     * @param buffer The bytes to decode
     * @param allowErrors Whether to throw errors (true) or return null on failure (false). False by default
     */
    static decode(buffer: ArrayBuffer, allowErrors = false): any {
        return decode(buffer, allowErrors);
    }

    /**
     * Encodes a JSON value into CBOR
     * 
     * @param data The value to encode
     * @param allowErrors Whether to throw errors (true) or return null on failure (false). False by default
     */
    static encode(data: any, allowErrors = false): ArrayBuffer | null {
        return encode(data, allowErrors);
    }

    /**
     * Same as `CBOR.encode`, but writes to the supplied buffer.
     * 
     * This function can be used to avoid many small allocations by supplying
     * a sufficiently large buffer.
     * 
     * @param data The value to encode
     * @param buffer The buffer to write to
     * @param allowErrors Whether to throw errors (true) or return null on failure (false). False by default
     */
    static encodeInto(data: any, buffer: ArrayBuffer, allowErrors = false): ArrayBuffer | null {
        return encode(data, allowErrors, buffer);
    }
}

export default CBOR;