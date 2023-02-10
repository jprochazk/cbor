// Copyright (C) 2020 Jan Procházka.
// This code is licensed under the MIT license. (see LICENSE for more details)

import { View } from "common/view"
import { ErrorCode, ParseError } from "decode/error"
import { SAX } from "decode/sax"

const DECODER = new TextDecoder;
export class Parser {
    private current_value: any;
    private readonly sax: SAX;
    private textDecoder: TextDecoder;
    constructor(
        private readonly view: View,
        max_depth = 100
    ) {
        this.sax = new SAX(max_depth);
        this.textDecoder = DECODER;
    }

    public parse() {
        // see https://tools.ietf.org/html/rfc7049#appendix-B to understand these values
        this.get();
        switch (true) {
            case (this.current_value <= 0x17):
                return this.sax.number(this.current_value);
            case (this.current_value === 0x18):
                return this.sax.number(this.view.getUint8());
            case (this.current_value === 0x19):
                return this.sax.number(this.view.getUint16());
            case (this.current_value === 0x1A):
                return this.sax.number(this.view.getUint32());
            case (this.current_value === 0x1B):
                throw ParseError.build(ErrorCode.UNSUPPORTED_64_BIT);
            //return this.sax.number((this.view.getUint64()) as unknown as number)
            case (this.current_value <= 0x37):
                return this.sax.number(-(1 + (this.current_value & 0b00011111)));
            case (this.current_value === 0x38):
                return this.sax.number(-(1 + this.view.getUint8()));
            case (this.current_value === 0x39):
                return this.sax.number(-(1 + this.view.getUint16()));
            case (this.current_value === 0x3A):
                return this.sax.number(-(1 + this.view.getUint32()));
            case (this.current_value === 0x3B):
                throw ParseError.build(ErrorCode.UNSUPPORTED_64_BIT);
            //return this.sax.number(-(add_number_bigint(1, this.view.getUint64())) as unknown as number)
            case (this.current_value <= 0x5F):
                return this.sax.byte_string(this.get_byte_string());
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
        let len = -1;
        switch (true) {
            case (this.current_value <= 0x77):
                len = this.current_value & 0b00011111;
                break;
            case (this.current_value === 0x78):
                len = this.view.getUint8();
                break;
            // these all work the same way
            /* istanbul ignore next */
            case (this.current_value === 0x79):
                len = this.view.getUint16();
                break;
            /* istanbul ignore next */
            case (this.current_value === 0x7A):
                len = this.view.getUint32();
                break;
            case (this.current_value === 0x7B):
                throw ParseError.build(ErrorCode.UNSUPPORTED_64_BIT);
            case (this.current_value === 0x7F): break;
        }
        const result: string[] = [];
        if (len > -1) {
            //if (typeof len === "bigint") {
            //    const bytes = [];
            //    for (let i = 0; i < len; i++) {
            //        bytes.push(this.get());
            //    }
            //    result.push(this.textDecoder.decode(new Uint8Array(bytes)));
            //} else {
            const bytes = this.view.getBytes(len);
            if (bytes.length > 0)
                result.push(this.textDecoder.decode(bytes));
            //}
        } else {
            const chunks = [];
            while (this.get() !== 0xFF) {
                chunks.push(this.get_string());
            }
            result.push(...chunks);
        }
        return result.join("");
    }

    private get_byte_string(): Uint8Array {
        let len = -1;
        switch (true) {
            case (this.current_value <= 0x57):
                len = this.current_value & 0b00011111;
                break;
            case (this.current_value === 0x58):
                len = this.view.getUint8();
                break;
            // these all work the same way
            /* istanbul ignore next */
            case (this.current_value === 0x59):
                len = this.view.getUint16();
                break;
            /* istanbul ignore next */
            case (this.current_value === 0x5A):
                len = this.view.getUint32();
                break;
            case (this.current_value === 0x5B):
                throw ParseError.build(ErrorCode.UNSUPPORTED_64_BIT);
            case (this.current_value === 0x5F): break;
        }
        let total_length = 0;
        const result: Uint8Array[] = [];
        if (len > -1) {
            //if (typeof len === "bigint") {
            //    const bytes = [];
            //    for (let i = 0; i < len; i++) {
            //        bytes.push(this.get());
            //    }
            //    result.push(this.textDecoder.decode(new Uint8Array(bytes)));
            //} else {
            const bytes = this.view.getBytes(len);
            if (bytes.length > 0) {
                result.push(bytes);
                total_length += bytes.length;
            }
            //}
        } else {
            while (this.get() !== 0xFF) {
                const chunk = this.get_byte_string();
                result.push(chunk);
                total_length += chunk.length;
            }
        }
        const temp = new Uint8Array(new ArrayBuffer(total_length));
        let offset = 0;
        for (let i = 0; i < result.length; ++i) {
            const chunk = result[i];
            temp.set(chunk, offset);
            offset += chunk.byteLength;
        }
        return temp;
    }

    private get_array(): any[] {
        this.sax.begin_array();

        let len = -1;
        switch (true) {
            case (this.current_value <= 0x97):
                len = this.current_value & 0b00011111;
                break;
            case (this.current_value === 0x98):
                len = this.view.getUint8();
                break;
            // these all work the same way
            /* istanbul ignore next */
            case (this.current_value === 0x99):
                len = this.view.getUint16();
                break;
            // these all work the same way
            /* istanbul ignore next */
            case (this.current_value === 0x9A):
                len = this.view.getUint32();
                break;
            case (this.current_value === 0x9B):
                throw ParseError.build(ErrorCode.UNSUPPORTED_64_BIT);
            case (this.current_value === 0x9F): break;
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

        let len = -1;
        switch (true) {
            case (this.current_value <= 0xB7):
                len = this.current_value & 0b00011111;
                break;
            case (this.current_value === 0xB8):
                len = this.view.getUint8();
                break;
            // these all work the same way
            /* istanbul ignore next */
            case (this.current_value === 0xB9):
                len = this.view.getUint16();
                break;
            // these all work the same way
            /* istanbul ignore next */
            case (this.current_value === 0xBA):
                len = this.view.getUint32();
                break;
            case (this.current_value === 0xBB):
                throw ParseError.build(ErrorCode.UNSUPPORTED_64_BIT);
        }
        if (len > -1) {
            for (let i = 0; i < len; i++) {
                this.get();
                this.sax.key(this.get_string());
                this.parse();
            }
        } else {
            while (this.get() !== 0xFF) {
                this.sax.key(this.get_string());
                this.parse();
            }
        }
        return this.sax.end_object();
    }
}