// Copyright (C) 2020 Jan Procházka. 
// This code is licensed under the MIT license. (see LICENSE for more details)
export class OutOfBoundsError extends Error {
    constructor(offset, length) {
        super(`View offset out of bounds: ${offset} > ${length}`);
        this.what = `View offset out of bounds: ${offset} > ${length}`;
    }
    toString() {
        return `OutOfBoundsError: ${this.what}`;
    }
}
export class View {
    constructor(buffer, offset = 0) {
        this.buffer = buffer;
        this.offset = offset;
        this.view = new DataView(this.buffer, 0, this.buffer.byteLength);
        this.arrayView = new Uint8Array(this.buffer);
    }
    slice(start, end) {
        return this.buffer.slice(start, end);
    }
    getFloat32() {
        this.offset += 4;
        if (this.offset > this.arrayView.byteLength)
            throw new OutOfBoundsError(this.offset, this.arrayView.byteLength);
        return this.view.getFloat32(this.offset - 4, false);
    }
    getFloat64() {
        this.offset += 8;
        if (this.offset > this.arrayView.byteLength)
            throw new OutOfBoundsError(this.offset, this.arrayView.byteLength);
        return this.view.getFloat64(this.offset - 8, false);
    }
    getInt8() {
        this.offset += 1;
        if (this.offset > this.arrayView.byteLength)
            throw new OutOfBoundsError(this.offset, this.arrayView.byteLength);
        return this.view.getInt8(this.offset - 1);
    }
    getInt16() {
        this.offset += 2;
        if (this.offset > this.arrayView.byteLength)
            throw new OutOfBoundsError(this.offset, this.arrayView.byteLength);
        return this.view.getInt16(this.offset - 2, false);
    }
    getInt32() {
        this.offset += 4;
        if (this.offset > this.arrayView.byteLength)
            throw new OutOfBoundsError(this.offset, this.arrayView.byteLength);
        return this.view.getInt32(this.offset - 4, false);
    }
    getInt64() {
        this.offset += 8;
        if (this.offset > this.arrayView.byteLength)
            throw new OutOfBoundsError(this.offset, this.arrayView.byteLength);
        return this.view.getBigInt64(this.offset - 8, false);
    }
    getUint8() {
        this.offset += 1;
        if (this.offset > this.arrayView.byteLength)
            throw new OutOfBoundsError(this.offset, this.arrayView.byteLength);
        return this.view.getUint8(this.offset - 1);
    }
    getUint16() {
        this.offset += 2;
        if (this.offset > this.arrayView.byteLength)
            throw new OutOfBoundsError(this.offset, this.arrayView.byteLength);
        return this.view.getUint16(this.offset - 2, false);
    }
    getUint32() {
        this.offset += 4;
        if (this.offset > this.arrayView.byteLength)
            throw new OutOfBoundsError(this.offset, this.arrayView.byteLength);
        return this.view.getUint32(this.offset - 4, false);
    }
    getUint64() {
        this.offset += 8;
        if (this.offset > this.arrayView.byteLength)
            throw new OutOfBoundsError(this.offset, this.arrayView.byteLength);
        return this.view.getBigUint64(this.offset - 8, false);
    }
    getBytes(length) {
        this.offset += length;
        if (this.offset > this.arrayView.byteLength)
            throw new OutOfBoundsError(this.offset, this.arrayView.byteLength);
        return new Uint8Array(this.view.buffer.slice(this.offset - length, this.offset));
    }
    setFloat32(value) {
        this.offset += 4;
        this.resize(this.offset);
        this.view.setFloat32(this.offset - 4, value, false);
    }
    setFloat64(value) {
        this.offset += 8;
        this.resize(this.offset);
        this.view.setFloat64(this.offset - 8, value, false);
    }
    setInt8(value) {
        this.offset += 1;
        this.resize(this.offset);
        this.view.setInt8(this.offset - 1, value);
    }
    setInt16(value) {
        this.offset += 2;
        this.resize(this.offset);
        this.view.setInt16(this.offset - 2, value, false);
    }
    setInt32(value) {
        this.offset += 4;
        this.resize(this.offset);
        this.view.setInt32(this.offset - 4, value, false);
    }
    setInt64(value) {
        this.offset += 8;
        this.resize(this.offset);
        this.view.setBigInt64(this.offset - 8, value, false);
    }
    setUint8(value) {
        this.offset += 1;
        this.resize(this.offset);
        this.view.setUint8(this.offset - 1, value);
    }
    setUint16(value) {
        this.offset += 2;
        this.resize(this.offset);
        this.view.setUint16(this.offset - 2, value, false);
    }
    setUint32(value) {
        this.offset += 4;
        this.resize(this.offset);
        this.view.setUint32(this.offset - 4, value, false);
    }
    setUint64(value) {
        this.offset += 8;
        this.resize(this.offset);
        this.view.setBigUint64(this.offset - 8, value, false);
    }
    setBytes(value) {
        this.offset += value.byteLength;
        this.resize(this.offset);
        this.arrayView.set(value, this.offset - value.byteLength);
    }
    resize(size) {
        if (this.buffer.byteLength > size) {
            return;
        }
        const oldBuffer = this.buffer;
        this.buffer = new ArrayBuffer(size);
        this.arrayView = new Uint8Array(this.buffer);
        this.arrayView.set(new Uint8Array(oldBuffer));
        this.view = new DataView(this.buffer);
    }
}
