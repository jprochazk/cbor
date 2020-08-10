export declare class CBOR {
    /**
     * Decodes a CBOR object into JSON
     *
     * @param buffer The bytes to decode
     * @param allowErrors Whether to throw errors (true) or return null on failure (false). False by default
     */
    static decode(buffer: ArrayBuffer, allowErrors?: boolean): any;
    /**
     * Encodes a JSON value into CBOR
     *
     * @param data The value to encode
     * @param allowErrors Whether to throw errors (true) or return null on failure (false). False by default
     */
    static encode(data: any, allowErrors?: boolean): ArrayBuffer | null;
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
    static encodeInto(data: any, buffer: ArrayBuffer, allowErrors?: boolean): ArrayBuffer | null;
}
export default CBOR;
