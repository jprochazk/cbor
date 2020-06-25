// Copyright (C) 2020 Jan Procházka. 
// This code is licensed under the MIT license. (see LICENSE for more details)

import { View } from './view'

/**
 * Decodes a CBOR object into JSON
 * 
 * If `allowErrors` is false (default), the parser will return null 
 * when faced with a parse error instead of throwing the error.
 */
export function decode(data: ArrayBuffer, allowErrors = false) {
    if (!allowErrors) {
        try {
            return new Parser(new View(data)).parse();
        } catch (error) {
            return null;
        }
    } else {
        return new Parser(new View(data)).parse();
    }
}

enum ErrorCode {
    UNEXPECTED_EOF = 0,
    REACHED_MAX_NESTING_DEPTH,
    EMPTY_STACK,
    UNEXPECTED_OBJECT_END,
    UNEXPECTED_ARRAY_END,
    UNSUPPORTED_BYTE_STRING,
    WRONG_STRING_FORMAT,
    UNSUPPORTED_HALF,
    UNEXPECTED_TOKEN,
    UNEXPECTED_VALUE
}
export class ParseError extends Error {

    private constructor(private what: string) {
        super(what);

    }

    public toString() {
        return `ParseError: ${this.what}`;
    }

    public static build(code: ErrorCode, info?: { [index: string]: any }) {
        switch (code) {
            case ErrorCode.UNEXPECTED_EOF:
                return new ParseError(`Unexpected EOF at offset ${(info) ? "" : info!.offset}`);
            case ErrorCode.REACHED_MAX_NESTING_DEPTH:
                return new ParseError(`Max recursion depth reached: ${(info) ? "" : info!.depth}`);
            case ErrorCode.EMPTY_STACK:
                return new ParseError(`Unexpected value before the start of an object or array`);
            case ErrorCode.UNEXPECTED_OBJECT_END:
                return new ParseError(`Unexpected end of object before the start of an object`);
            case ErrorCode.UNEXPECTED_ARRAY_END:
                return new ParseError(`Unexpected end of array before the start of an array`);
            case ErrorCode.UNSUPPORTED_BYTE_STRING:
                return new ParseError(`byte strings are unsupported`);
            case ErrorCode.WRONG_STRING_FORMAT:
                return new ParseError(`Expected string length value range 0x60 to 0x7F, found: ${info!.token}`);
            case ErrorCode.UNSUPPORTED_HALF:
                return new ParseError(`Half (IEEE754 binary16) is unsupported`);
            case ErrorCode.UNEXPECTED_TOKEN:
                return new ParseError(`Unexpected token: ${info!.token}`);
            case ErrorCode.UNEXPECTED_VALUE:
                return new ParseError(`Found value before key in object`);
            default:
                return new ParseError(`Unknown error code`);
        }
    }
}

class StackRef {
    constructor(
        private type: "object" | "array",
        private value: any
    ) { }

    isArray(): boolean {
        return this.type === "array";
    }

    isObject(): boolean {
        return !this.isArray();
    }

    array(): any[] {
        return this.value as any[];
    }

    object(): { [index: string]: any } {
        return this.value as { [index: string]: any };
    }
}

class Stack {
    private stack: StackRef[] = [];

    get length(): number {
        return this.stack.length;
    }

    push(type: "object" | "array", value: any) {
        this.stack.push(new StackRef(type, value));
    }

    pop() {
        return this.stack.pop();
    }

    last() {
        return this.stack[this.stack.length - 1];
    }

    empty() {
        return this.stack.length === 0;
    }
}

class JsonSax {
    /**
     * The root element
     */
    private root: any = null;
    /**
     * Stack of objects or arrays 
     */
    private stack: Stack = new Stack();
    /**
     * Next element if the stack has an object at the top
     */
    private last_key: string | null = null;

    constructor(
        private readonly max_depth: number
    ) {

    }

    null(): null {
        return this.handle(null);
    }

    undefined(): undefined {
        return this.handle(undefined);
    }

    boolean(value: boolean): boolean {
        return this.handle(value);
    }

    number(value: number): number {
        return this.handle(value);
    }

    string(value: string): string {
        return this.handle(value);
    }

    begin_object() {
        this.stack.push("object", this.handle({}));

        if (this.stack.length > this.max_depth) {
            throw ParseError.build(ErrorCode.REACHED_MAX_NESTING_DEPTH, { depth: this.max_depth });
        }
    }

    key(value: string) {
        const stack_top = this.stack.last();
        if (!stack_top) {
            throw ParseError.build(ErrorCode.EMPTY_STACK);
        }

        stack_top.object()[value] = null;
        this.last_key = value;
    }

    end_object() {
        if (this.stack.empty() || !this.stack.last().isObject()) {
            throw ParseError.build(ErrorCode.UNEXPECTED_OBJECT_END);
        }

        return this.stack.pop()!.object();
    }

    begin_array() {
        this.stack.push("array", this.handle([]));

        if (this.stack.length > this.max_depth) {
            throw ParseError.build(ErrorCode.REACHED_MAX_NESTING_DEPTH, { depth: this.max_depth });
        }
    }

    end_array() {
        if (this.stack.empty() || !this.stack.last().isArray()) {
            throw ParseError.build(ErrorCode.UNEXPECTED_ARRAY_END);
        }

        return this.stack.pop()!.array();
    }

    private handle(value: any): any {
        if (this.stack.length === 0 && this.root === null) {
            this.root = value;
            return value;
        }

        const stack_top = this.stack.last();
        if (stack_top.isArray()) {
            stack_top.array().push(value);
            return value;
        }
        else if (stack_top.isObject()) {
            if (!this.last_key) throw ParseError.build(ErrorCode.UNEXPECTED_VALUE);
            stack_top.object()[this.last_key] = value;
            return value;
        }
    }
}

const INFO_MASK = 0b00011111;
const TEXT_DECODER = new TextDecoder();

function add_number_bigint(a: number, b: number | bigint): number | bigint {
    if (typeof b === 'bigint') {
        return BigInt(a) + b;
    } else {
        const result = a + b;
        if (-Number.MAX_SAFE_INTEGER <= result && result <= Number.MAX_SAFE_INTEGER) {
            return result;
        } else {
            return BigInt(result);
        }
    }
}

class Parser {
    private current_value: any;
    private readonly sax: JsonSax;
    constructor(
        private readonly view: View,
        max_depth = 100
    ) {
        this.sax = new JsonSax(max_depth);
    }

    public parse() {
        // see https://tools.ietf.org/html/rfc7049#appendix-B to understand these values
        this.get();
        switch (true) {
            case (this.current_value < 0x00): throw ParseError.build(ErrorCode.UNEXPECTED_EOF, { offset: this.view.offset });
            case (this.current_value <= 0x17):
                return this.sax.number(this.current_value);
            case (this.current_value === 0x18):
                return this.sax.number(this.view.getUint8());
            case (this.current_value === 0x19):
                return this.sax.number(this.view.getUint16());
            case (this.current_value === 0x1A):
                return this.sax.number(this.view.getUint32());
            case (this.current_value === 0x1B):
                return this.sax.number((this.view.getUint64()) as unknown as number)
            case (this.current_value <= 0x37):
                return this.sax.number(-(1 + (this.current_value & INFO_MASK)));
            case (this.current_value === 0x38):
                return this.sax.number(-(1 + this.view.getUint8()));
            case (this.current_value === 0x39):
                return this.sax.number(-(1 + this.view.getUint16()));
            case (this.current_value === 0x3A):
                return this.sax.number(-(1 + this.view.getUint32()));
            case (this.current_value === 0x3B):
                return this.sax.number(-(add_number_bigint(1, this.view.getUint64())) as unknown as number)
            case (this.current_value <= 0x5F):
                throw ParseError.build(ErrorCode.UNSUPPORTED_BYTE_STRING);
            case (this.current_value <= 0x7F):
                return this.sax.string(this.get_string());
            case (this.current_value <= 0x9F):
                return this.get_array();
            case (this.current_value <= 0xBF):
                return this.get_object();
            case (this.current_value === 0xF4):
                return this.sax.boolean(false);
            case (this.current_value === 0xF5):
                return this.sax.boolean(true);
            case (this.current_value === 0xF6):
                return this.sax.null();
            case (this.current_value === 0xF7):
                return this.sax.undefined();
            case (this.current_value === 0xF9):
                throw ParseError.build(ErrorCode.UNSUPPORTED_HALF);
            case (this.current_value === 0xFA):
                return this.sax.number(this.view.getFloat32());
            case (this.current_value === 0xFB):
                return this.sax.number(this.view.getFloat64());
        }
    }

    private get(): number {
        this.current_value = this.view.getUint8();
        return this.current_value;
    }

    private get_string(): string {
        let len: number | bigint = -1;
        switch (true) {
            case (this.current_value <= 0x77):
                len = this.current_value & INFO_MASK;
                break;
            case (this.current_value === 0x78):
                len = this.view.getUint8();
                break;
            case (this.current_value === 0x79):
                len = this.view.getUint16();
                break;
            case (this.current_value === 0x7A):
                len = this.view.getUint32();
                break;
            case (this.current_value === 0x7B):
                len = this.view.getUint64();
                break;
            case (this.current_value === 0x7F): break;
            default:
                throw ParseError.build(ErrorCode.WRONG_STRING_FORMAT, { token: `0x${this.current_value.toString(16).toUpperCase()}` });
        }
        const result: string[] = [];
        if (len > -1) {
            if (typeof len === "bigint") {
                const bytes = [];
                for (let i = 0; i < len; i++) {
                    bytes.push(this.get());
                }
                result.push(TEXT_DECODER.decode(new Uint8Array(bytes)));
            } else {
                const bytes = this.view.getBytes(len);
                if (bytes.length > 0)
                    result.push(TEXT_DECODER.decode(bytes));
            }
        } else {
            const chunks = [];
            while (this.get() != 0xFF) {
                chunks.push(this.get_string());
            }
            result.push(...chunks);
        }
        return result.join("");
    }

    private get_array(): any[] {
        this.sax.begin_array();

        let len: number | bigint = -1;
        switch (true) {
            case (this.current_value <= 0x97):
                len = this.current_value & INFO_MASK;
                break;
            case (this.current_value === 0x98):
                len = this.view.getUint8();
                break;
            case (this.current_value === 0x99):
                len = this.view.getUint16();
                break;
            case (this.current_value === 0x9A):
                len = this.view.getUint32();
                break;
            case (this.current_value === 0x9B):
                len = this.view.getUint64();
                break;
            case (this.current_value === 0x9F): break;
            default:
                throw ParseError.build(ErrorCode.UNEXPECTED_TOKEN, { token: `0x${this.current_value.toString(16).toUpperCase()}` })
        }
        if (len > -1) {
            for (let i = 0; i < len; i++) {
                this.parse();
            }
        } else {
            while (this.current_value !== 0xFF) {
                this.parse();
            }
        }
        return this.sax.end_array();
    }

    private get_object(): { [index: string]: any } {
        this.sax.begin_object();

        let len: number | bigint = -1;
        switch (true) {
            case (this.current_value <= 0xB7):
                len = this.current_value & INFO_MASK;
                break;
            case (this.current_value === 0xB8):
                len = this.view.getUint8();
                break;
            case (this.current_value === 0xB9):
                len = this.view.getUint16();
                break;
            case (this.current_value === 0xBA):
                len = this.view.getUint32();
                break;
            case (this.current_value === 0xBB):
                len = this.view.getUint64();
                break;
        }
        if (len > -1) {
            for (let i = 0; i < len; i++) {
                this.get();
                this.sax.key(this.get_string());
                this.parse();
            }
        } else {
            while (this.get() != 0xFF) {
                this.sax.key(this.get_string());
                this.parse();
            }
        }
        return this.sax.end_object();
    }
}