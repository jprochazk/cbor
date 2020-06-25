// Copyright (C) 2020 Jan Procházka.
// This code is licensed under the MIT license. (see LICENSE for more details)

export class StackRef {
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

export class Stack {
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