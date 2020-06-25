/**
 * Decodes a CBOR object into JSON
 *
 * If `allowErrors` is false (default), the parser will return null
 * when faced with a parse error instead of throwing the error.
 */
export declare function decode(data: ArrayBuffer, allowErrors?: boolean): string | number | boolean | {
    [index: string]: any;
} | null | undefined;
