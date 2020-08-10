// Copyright (C) 2020 Jan Procházka.
// This code is licensed under the MIT license. (see LICENSE for more details)
import { Stack } from './stack';
import { ErrorCode, ParseError } from './error';
var SAX = /** @class */ (function () {
    function SAX(max_depth) {
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
    SAX.prototype.null = function () {
        return this.handle(null);
    };
    SAX.prototype.undefined = function () {
        return this.handle(undefined);
    };
    SAX.prototype.boolean = function (value) {
        return this.handle(value);
    };
    SAX.prototype.number = function (value) {
        return this.handle(value);
    };
    SAX.prototype.string = function (value) {
        return this.handle(value);
    };
    SAX.prototype.begin_object = function () {
        this.stack.push("object", this.handle({}));
        if (this.stack.length > this.max_depth) {
            throw ParseError.build(ErrorCode.REACHED_MAX_NESTING_DEPTH, { depth: this.max_depth });
        }
    };
    SAX.prototype.key = function (value) {
        var stack_top = this.stack.last();
        if (!stack_top) {
            throw ParseError.build(ErrorCode.EMPTY_STACK);
        }
        stack_top.object()[value] = null;
        this.last_key = value;
    };
    SAX.prototype.end_object = function () {
        if (this.stack.empty() || !this.stack.last().isObject()) {
            throw ParseError.build(ErrorCode.UNEXPECTED_OBJECT_END);
        }
        return this.stack.pop().object();
    };
    SAX.prototype.begin_array = function () {
        this.stack.push("array", this.handle([]));
        if (this.stack.length > this.max_depth) {
            throw ParseError.build(ErrorCode.REACHED_MAX_NESTING_DEPTH, { depth: this.max_depth });
        }
    };
    SAX.prototype.end_array = function () {
        if (this.stack.empty() || !this.stack.last().isArray()) {
            throw ParseError.build(ErrorCode.UNEXPECTED_ARRAY_END);
        }
        return this.stack.pop().array();
    };
    SAX.prototype.handle = function (value) {
        if (this.stack.length === 0 && this.root === null) {
            this.root = value;
            return value;
        }
        var stack_top = this.stack.last();
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
    };
    return SAX;
}());
export { SAX };
