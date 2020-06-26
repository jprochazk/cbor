export declare class Writer {
    private view;
    constructor(buffer: ArrayBuffer);
    finalize(): ArrayBuffer;
    write(value: any): void;
}
