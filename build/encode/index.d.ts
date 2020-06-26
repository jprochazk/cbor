/**
 * Encodes a JSON value into CBOR
 *
 * If `allowErrors` is false (default), the writer will return null
 * when faced with a write error instead of throwing the error.
 */
export declare function encode(data: any, allowErrors: boolean, out?: ArrayBuffer): ArrayBuffer | null;
