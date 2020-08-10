export declare class OutOfBoundsError extends Error {
    private what;
    constructor(offset: number, length: number);
    toString(): string;
}
export declare class View {
    private buffer;
    offset: number;
    private view;
    private arrayView;
    constructor(buffer: ArrayBuffer, offset?: number);
    slice(start: number, end?: number): ArrayBuffer;
    getFloat32(): number;
    getFloat64(): number;
    getInt8(): number;
    getInt16(): number;
    getInt32(): number;
    getInt64(): bigint;
    getUint8(): number;
    getUint16(): number;
    getUint32(): number;
    getUint64(): number | bigint;
    getBytes(length: number): Uint8Array;
    setFloat32(value: number): void;
    setFloat64(value: number): void;
    setInt8(value: number): void;
    setInt16(value: number): void;
    setInt32(value: number): void;
    setInt64(value: bigint): void;
    setUint8(value: number): void;
    setUint16(value: number): void;
    setUint32(value: number): void;
    setUint64(value: bigint): void;
    setBytes(value: Uint8Array): void;
    resize(size: number): void;
}
