// Copyright (C) 2020 Jan Procházka.
// This code is licensed under the MIT license. (see LICENSE for more details)
import { Stack } from './stack';
import { ErrorCode, ParseError } from './error';
export class SAX {
    constructor(max_depth) {
        this.max_depth = max_depth;
        /**
         * The root element
         */
        this.root = null;
        /**
         * Stack of objects or arrays
         */
        this.stack = new Stack();
        /**
         * Next element if the stack has an object at the top
         */
        this.last_key = null;
    }
    null() {
        return this.handle(null);
    }
    undefined() {
        return this.handle(undefined);
    }
    boolean(value) {
        return this.handle(value);
    }
    number(value) {
        return this.handle(value);
    }
    string(value) {
        return this.handle(value);
    }
    begin_object() {
        this.stack.push("object", this.handle({}));
        if (this.stack.length > this.max_depth) {
            throw ParseError.build(ErrorCode.REACHED_MAX_NESTING_DEPTH, { depth: this.max_depth });
        }
    }
    key(value) {
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
        return this.stack.pop().object();
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
        return this.stack.pop().array();
    }
    handle(value) {
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
            if (!this.last_key)
                throw ParseError.build(ErrorCode.UNEXPECTED_VALUE);
            stack_top.object()[this.last_key] = value;
            return value;
        }
    }
}
