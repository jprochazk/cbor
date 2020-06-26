export declare class SAX {
    private readonly max_depth;
    /**
     * The root element
     */
    private root;
    /**
     * Stack of objects or arrays
     */
    private stack;
    /**
     * Next element if the stack has an object at the top
     */
    private last_key;
    constructor(max_depth: number);
    null(): null;
    undefined(): undefined;
    boolean(value: boolean): boolean;
    number(value: number): number;
    string(value: string): string;
    begin_object(): void;
    key(value: string): void;
    end_object(): {
        [index: string]: any;
    };
    begin_array(): void;
    end_array(): any[];
    private handle;
}
