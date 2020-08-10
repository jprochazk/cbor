export declare class StackRef {
    private type;
    private value;
    constructor(type: "object" | "array", value: any);
    isArray(): boolean;
    isObject(): boolean;
    array(): any[];
    object(): {
        [index: string]: any;
    };
}
export declare class Stack {
    private stack;
    get length(): number;
    push(type: "object" | "array", value: any): void;
    pop(): StackRef | undefined;
    last(): StackRef;
    empty(): boolean;
}
