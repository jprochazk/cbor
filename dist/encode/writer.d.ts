export declare class Writer {
    private view;
    private textEncoder;
    constructor(buffer: ArrayBuffer);
    finalize(): ArrayBuffer;
    write(value: any): void;
}
