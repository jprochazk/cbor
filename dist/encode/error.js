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
import { NUMERIC_LIMITS } from "./util";
export var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["UNEXPECTED_TOKEN"] = 0] = "UNEXPECTED_TOKEN";
    ErrorCode[ErrorCode["UNSUPPORTED_BIGINT"] = 1] = "UNSUPPORTED_BIGINT";
    ErrorCode[ErrorCode["STRING_TOO_LARGE"] = 2] = "STRING_TOO_LARGE";
    ErrorCode[ErrorCode["ARRAY_TOO_LARGE"] = 3] = "ARRAY_TOO_LARGE";
    ErrorCode[ErrorCode["OBJECT_TOO_LARGE"] = 4] = "OBJECT_TOO_LARGE";
    ErrorCode[ErrorCode["NUMBER_TOO_LARGE"] = 5] = "NUMBER_TOO_LARGE";
})(ErrorCode || (ErrorCode = {}));
var WriteError = /** @class */ (function (_super) {
    __extends(WriteError, _super);
    function WriteError(what) {
        var _this = _super.call(this, what) || this;
        _this.what = what;
        return _this;
    }
    WriteError.prototype.toString = function () {
        return "ParseError: " + this.what;
    };
    WriteError.build = function (code, info) {
        switch (code) {
            case ErrorCode.UNEXPECTED_TOKEN:
                return new WriteError("Unexpected token: " + info.token.toString());
            case ErrorCode.UNSUPPORTED_BIGINT:
                return new WriteError("BigInt is unsupported");
            case ErrorCode.STRING_TOO_LARGE:
                return new WriteError("Max String length is " + NUMERIC_LIMITS.UINT32 + ", found: " + info.size);
            case ErrorCode.ARRAY_TOO_LARGE:
                return new WriteError("Max Array length is " + NUMERIC_LIMITS.UINT32 + ", found: " + info.size);
            case ErrorCode.OBJECT_TOO_LARGE:
                return new WriteError("Max Object length is " + NUMERIC_LIMITS.UINT32 + ", found: " + info.size);
            case ErrorCode.NUMBER_TOO_LARGE:
                return new WriteError("Max Number is " + Number.MAX_SAFE_INTEGER + ", found: " + info.number);
            default:
                return new WriteError("Unknown error code");
        }
    };
    return WriteError;
}(Error));
export { WriteError };
