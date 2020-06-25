// Copyright (C) 2020 Jan Procházka. 
// This code is licensed under the MIT license. (see LICENSE for more details)

import { View } from 'common/view'
import { Parser } from './parser'

/**
 * Decodes a CBOR object into JSON
 * 
 * If `allowErrors` is false (default), the parser will return null 
 * when faced with a parse error instead of throwing the error.
 */
export function decode(data: ArrayBuffer, allowErrors = false) {
    if (!allowErrors) {
        try {
            return new Parser(new View(data)).parse();
        } catch (error) {
            return null;
        }
    } else {
        return new Parser(new View(data)).parse();
    }
}