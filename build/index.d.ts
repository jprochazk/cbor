export declare class CBOR {
    /**
     * Decodes a CBOR object into JSON
     *
     * @param buffer The bytes to decode
     * @param allowErrors Whether to throw errors or return null on failure. Default false
     */
    static decode(buffer: ArrayBuffer, allowErrors?: boolean): any;
    static encode(data: any, allowErrors?: boolean): ArrayBuffer | null;
    static encodeInto(data: any, buffer: ArrayBuffer, allowErrors?: boolean): ArrayBuffer | null;
}
export default CBOR;
