// Copyright (C) 2020 Jan Procházka. 
// This code is licensed under the MIT license. (see LICENSE for more details)

// TODO: publish on npm

import { decode } from './decode'
import { encode } from './encode'

export class CBOR {
    /**
     * Decodes a CBOR object into JSON
     * 
     * @param buffer The bytes to decode
     * @param allowErrors Whether to throw errors or return null on failure. Default false
     */
    static decode(buffer: ArrayBuffer, allowErrors = false): any {
        return decode(buffer, allowErrors);
    }

    static encode(data: any, allowErrors = false): ArrayBuffer | null {
        return encode(data, allowErrors);
    }

    static encodeInto(data: any, buffer: ArrayBuffer, allowErrors = false): ArrayBuffer | null {
        return encode(data, allowErrors, buffer);
    }
}

export default CBOR;