// Copyright (C) 2020 Jan Procházka. 
// This code is licensed under the MIT license. (see LICENSE for more details)
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var OutOfBoundsError = /** @class */ (function (_super) {
    __extends(OutOfBoundsError, _super);
    function OutOfBoundsError(offset, length) {
        var _this = _super.call(this, "View offset out of bounds: " + offset + " > " + length) || this;
        _this.what = "View offset out of bounds: " + offset + " > " + length;
        return _this;
    }
    OutOfBoundsError.prototype.toString = function () {
        return "OutOfBoundsError: " + this.what;
    };
    return OutOfBoundsError;
}(Error));
export { OutOfBoundsError };
var GROWTH_FACTOR = 2;
var View = /** @class */ (function () {
    function View(buffer, offset) {
        if (offset === void 0) { offset = 0; }
        this.buffer = buffer;
        this.offset = offset;
        this.view = new DataView(this.buffer, 0, this.buffer.byteLength);
        this.arrayView = new Uint8Array(this.buffer);
    }
    View.prototype.slice = function (start, end) {
        return this.buffer.slice(start, end);
    };
    View.prototype.getFloat32 = function () {
        this.offset += 4;
        if (this.offset > this.arrayView.byteLength)
            throw new OutOfBoundsError(this.offset, this.arrayView.byteLength);
        return this.view.getFloat32(this.offset - 4, false);
    };
    View.prototype.getFloat64 = function () {
        this.offset += 8;
        if (this.offset > this.arrayView.byteLength)
            throw new OutOfBoundsError(this.offset, this.arrayView.byteLength);
        return this.view.getFloat64(this.offset - 8, false);
    };
    View.prototype.getInt8 = function () {
        this.offset += 1;
        if (this.offset > this.arrayView.byteLength)
            throw new OutOfBoundsError(this.offset, this.arrayView.byteLength);
        return this.view.getInt8(this.offset - 1);
    };
    View.prototype.getInt16 = function () {
        this.offset += 2;
        if (this.offset > this.arrayView.byteLength)
            throw new OutOfBoundsError(this.offset, this.arrayView.byteLength);
        return this.view.getInt16(this.offset - 2, false);
    };
    View.prototype.getInt32 = function () {
        this.offset += 4;
        if (this.offset > this.arrayView.byteLength)
            throw new OutOfBoundsError(this.offset, this.arrayView.byteLength);
        return this.view.getInt32(this.offset - 4, false);
    };
    View.prototype.getInt64 = function () {
        this.offset += 8;
        if (this.offset > this.arrayView.byteLength)
            throw new OutOfBoundsError(this.offset, this.arrayView.byteLength);
        return this.view.getBigInt64(this.offset - 8, false);
    };
    View.prototype.getUint8 = function () {
        this.offset += 1;
        if (this.offset > this.arrayView.byteLength)
            throw new OutOfBoundsError(this.offset, this.arrayView.byteLength);
        return this.view.getUint8(this.offset - 1);
    };
    View.prototype.getUint16 = function () {
        this.offset += 2;
        if (this.offset > this.arrayView.byteLength)
            throw new OutOfBoundsError(this.offset, this.arrayView.byteLength);
        return this.view.getUint16(this.offset - 2, false);
    };
    View.prototype.getUint32 = function () {
        this.offset += 4;
        if (this.offset > this.arrayView.byteLength)
            throw new OutOfBoundsError(this.offset, this.arrayView.byteLength);
        return this.view.getUint32(this.offset - 4, false);
    };
    View.prototype.getUint64 = function () {
        this.offset += 8;
        if (this.offset > this.arrayView.byteLength)
            throw new OutOfBoundsError(this.offset, this.arrayView.byteLength);
        return this.view.getBigUint64(this.offset - 8, false);
    };
    View.prototype.getBytes = function (length) {
        this.offset += length;
        if (this.offset > this.arrayView.byteLength)
            throw new OutOfBoundsError(this.offset, this.arrayView.byteLength);
        return new Uint8Array(this.buffer.slice(this.offset - length, this.offset));
    };
    View.prototype.setFloat32 = function (value) {
        this.offset += 4;
        this.resize(this.offset);
        this.view.setFloat32(this.offset - 4, value, false);
    };
    View.prototype.setFloat64 = function (value) {
        this.offset += 8;
        this.resize(this.offset);
        this.view.setFloat64(this.offset - 8, value, false);
    };
    View.prototype.setInt8 = function (value) {
        this.offset += 1;
        this.resize(this.offset);
        this.view.setInt8(this.offset - 1, value);
    };
    View.prototype.setInt16 = function (value) {
        this.offset += 2;
        this.resize(this.offset);
        this.view.setInt16(this.offset - 2, value, false);
    };
    View.prototype.setInt32 = function (value) {
        this.offset += 4;
        this.resize(this.offset);
        this.view.setInt32(this.offset - 4, value, false);
    };
    View.prototype.setInt64 = function (value) {
        this.offset += 8;
        this.resize(this.offset);
        this.view.setBigInt64(this.offset - 8, value, false);
    };
    View.prototype.setUint8 = function (value) {
        this.offset += 1;
        this.resize(this.offset);
        this.view.setUint8(this.offset - 1, value);
    };
    View.prototype.setUint16 = function (value) {
        this.offset += 2;
        this.resize(this.offset);
        this.view.setUint16(this.offset - 2, value, false);
    };
    View.prototype.setUint32 = function (value) {
        this.offset += 4;
        this.resize(this.offset);
        this.view.setUint32(this.offset - 4, value, false);
    };
    View.prototype.setUint64 = function (value) {
        this.offset += 8;
        this.resize(this.offset);
        this.view.setBigUint64(this.offset - 8, value, false);
    };
    View.prototype.setBytes = function (value) {
        this.offset += value.byteLength;
        this.resize(this.offset);
        this.arrayView.set(value, this.offset - value.byteLength);
    };
    View.prototype.resize = function (size) {
        if (this.buffer.byteLength > size) {
            return;
        }
        var oldBuffer = this.buffer;
        this.buffer = new ArrayBuffer(size * GROWTH_FACTOR);
        this.arrayView = new Uint8Array(this.buffer);
        this.arrayView.set(new Uint8Array(oldBuffer));
        this.view = new DataView(this.buffer);
    };
    return View;
}());
export { View };
