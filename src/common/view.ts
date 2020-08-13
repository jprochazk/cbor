// Copyright (C) 2020 Jan Procházka. 
// This code is licensed under the MIT license. (see LICENSE for more details)

export class OutOfBoundsError extends Error {
    private what: string;
    constructor(offset: number, length: number) {
        super(`View offset out of bounds: ${offset} > ${length}`);
        this.what = `View offset out of bounds: ${offset} > ${length}`;
    }
}

const GROWTH_FACTOR = 2;

export class View {
    private view: DataView;
    private arrayView: Uint8Array;
    constructor(
        private buffer: ArrayBuffer,
        public offset = 0
    ) {
        this.view = new DataView(this.buffer, 0, this.buffer.byteLength);
        this.arrayView = new Uint8Array(this.buffer);
    }

    public slice(start: number, end?: number): ArrayBuffer {
        return this.buffer.slice(start, end);
    }

    public getFloat32(): number {
        this.offset += 4;
        if (this.offset > this.arrayView.byteLength)
            throw new OutOfBoundsError(this.offset, this.arrayView.byteLength);
        return this.view.getFloat32(this.offset - 4, false);
    }
    public getFloat64(): number {
        this.offset += 8;
        if (this.offset > this.arrayView.byteLength)
            throw new OutOfBoundsError(this.offset, this.arrayView.byteLength);
        return this.view.getFloat64(this.offset - 8, false);
    }
    // these getter aren't ever actually used in the code
    /* istanbul ignore next */
    public getInt8(): number {
        this.offset += 1;
        if (this.offset > this.arrayView.byteLength)
            throw new OutOfBoundsError(this.offset, this.arrayView.byteLength);
        return this.view.getInt8(this.offset - 1);
    }
    /* istanbul ignore next */
    public getInt16(): number {
        this.offset += 2;
        if (this.offset > this.arrayView.byteLength)
            throw new OutOfBoundsError(this.offset, this.arrayView.byteLength);
        return this.view.getInt16(this.offset - 2, false);
    }
    /* istanbul ignore next */
    public getInt32(): number {
        this.offset += 4;
        if (this.offset > this.arrayView.byteLength)
            throw new OutOfBoundsError(this.offset, this.arrayView.byteLength);
        return this.view.getInt32(this.offset - 4, false);
    }
    /* istanbul ignore next */
    public getInt64(): bigint {
        this.offset += 8;
        if (this.offset > this.arrayView.byteLength)
            throw new OutOfBoundsError(this.offset, this.arrayView.byteLength);
        return this.view.getBigInt64(this.offset - 8, false);
    }
    public getUint8(): number {
        this.offset += 1;
        if (this.offset > this.arrayView.byteLength)
            throw new OutOfBoundsError(this.offset, this.arrayView.byteLength);
        return this.view.getUint8(this.offset - 1);
    }
    public getUint16(): number {
        this.offset += 2;
        if (this.offset > this.arrayView.byteLength)
            throw new OutOfBoundsError(this.offset, this.arrayView.byteLength);
        return this.view.getUint16(this.offset - 2, false);
    }
    public getUint32(): number {
        this.offset += 4;
        if (this.offset > this.arrayView.byteLength)
            throw new OutOfBoundsError(this.offset, this.arrayView.byteLength);
        return this.view.getUint32(this.offset - 4, false);
    }
    // 64-bit unsupported for now
    /* istanbul ignore next */
    public getUint64(): number | bigint {
        this.offset += 8;
        if (this.offset > this.arrayView.byteLength)
            throw new OutOfBoundsError(this.offset, this.arrayView.byteLength);
        return this.view.getBigUint64(this.offset - 8, false);
    }
    public getBytes(length: number): Uint8Array {
        this.offset += length;
        if (this.offset > this.arrayView.byteLength)
            throw new OutOfBoundsError(this.offset, this.arrayView.byteLength);
        return new Uint8Array(this.buffer.slice(this.offset - length, this.offset));
    }
    public setFloat32(value: number): void {
        this.offset += 4;
        this.resize(this.offset);
        this.view.setFloat32(this.offset - 4, value, false);
    }
    public setFloat64(value: number): void {
        this.offset += 8;
        this.resize(this.offset);
        this.view.setFloat64(this.offset - 8, value, false);
    }
    // these setters are never actually used
    /* istanbul ignore next */
    public setInt8(value: number): void {
        this.offset += 1;
        this.resize(this.offset);
        this.view.setInt8(this.offset - 1, value);
    }
    /* istanbul ignore next */
    public setInt16(value: number): void {
        this.offset += 2;
        this.resize(this.offset);
        this.view.setInt16(this.offset - 2, value, false);
    }
    /* istanbul ignore next */
    public setInt32(value: number): void {
        this.offset += 4;
        this.resize(this.offset);
        this.view.setInt32(this.offset - 4, value, false);
    }
    /* istanbul ignore next */
    public setInt64(value: bigint): void {
        this.offset += 8;
        this.resize(this.offset);
        this.view.setBigInt64(this.offset - 8, value, false);
    }
    public setUint8(value: number): void {
        this.offset += 1;
        this.resize(this.offset);
        this.view.setUint8(this.offset - 1, value);
    }
    public setUint16(value: number): void {
        this.offset += 2;
        this.resize(this.offset);
        this.view.setUint16(this.offset - 2, value, false);
    }
    public setUint32(value: number): void {
        this.offset += 4;
        this.resize(this.offset);
        this.view.setUint32(this.offset - 4, value, false);
    }
    // 64-bit is unsupported
    /* istanbul ignore next */
    public setUint64(value: bigint): void {
        this.offset += 8;
        this.resize(this.offset);
        this.view.setBigUint64(this.offset - 8, value, false);
    }
    public setBytes(value: Uint8Array): void {
        this.offset += value.byteLength;
        this.resize(this.offset);
        this.arrayView.set(value, this.offset - value.byteLength);
    }

    public resize(size: number) {
        if (this.buffer.byteLength > size) {
            return;
        }

        const oldBuffer = this.buffer;
        this.buffer = new ArrayBuffer(size * GROWTH_FACTOR);
        this.arrayView = new Uint8Array(this.buffer);
        this.arrayView.set(new Uint8Array(oldBuffer));
        this.view = new DataView(this.buffer);
    }
}