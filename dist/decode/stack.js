// Copyright (C) 2020 Jan Procházka.
// This code is licensed under the MIT license. (see LICENSE for more details)
var StackRef = /** @class */ (function () {
    function StackRef(type, value) {
        this.type = type;
        this.value = value;
    }
    StackRef.prototype.isArray = function () {
        return this.type === "array";
    };
    StackRef.prototype.isObject = function () {
        return !this.isArray();
    };
    StackRef.prototype.array = function () {
        return this.value;
    };
    StackRef.prototype.object = function () {
        return this.value;
    };
    return StackRef;
}());
export { StackRef };
var Stack = /** @class */ (function () {
    function Stack() {
        this.stack = [];
    }
    Object.defineProperty(Stack.prototype, "length", {
        get: function () {
            return this.stack.length;
        },
        enumerable: false,
        configurable: true
    });
    Stack.prototype.push = function (type, value) {
        this.stack.push(new StackRef(type, value));
    };
    Stack.prototype.pop = function () {
        return this.stack.pop();
    };
    Stack.prototype.last = function () {
        return this.stack[this.stack.length - 1];
    };
    Stack.prototype.empty = function () {
        return this.stack.length === 0;
    };
    return Stack;
}());
export { Stack };
