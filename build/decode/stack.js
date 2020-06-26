// Copyright (C) 2020 Jan Procházka.
// This code is licensed under the MIT license. (see LICENSE for more details)
export class StackRef {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
    isArray() {
        return this.type === "array";
    }
    isObject() {
        return !this.isArray();
    }
    array() {
        return this.value;
    }
    object() {
        return this.value;
    }
}
export class Stack {
    constructor() {
        this.stack = [];
    }
    get length() {
        return this.stack.length;
    }
    push(type, value) {
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
