export declare const NUMERIC_LIMITS: {
    UINT8: number;
    UINT16: number;
    UINT32: number;
    UINT64: bigint;
    FLOAT32: number;
    FLOAT64: number;
};
export declare function isFloat(value: any): boolean;
export declare function get_type(value: any): "object" | "array" | "string" | "number" | "boolean" | "null";
