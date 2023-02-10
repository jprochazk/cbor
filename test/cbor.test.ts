// Copyright (C) 2020 Jan Procházka. 
// This code is licensed under the MIT license. (see LICENSE for more details)

import CBOR from "../src/index";

// TODO: write error cases

const decode_cases = [
    ["0", [0], 0],
    ["1", [1], 1],
    ["10", [10], 10],
    ["23", [23], 23],
    ["24", [24, 24], 24],
    ["25", [24, 25], 25],
    ["100", [24, 100], 100],
    ["1000", [25, 3, 232], 1000],
    ["1000000", [26, 0, 15, 66, 64], 1000000],
    ["-1", [32], -1],
    ["-10", [41], -10],
    ["-24", [55], -24],
    ["-25", [56, 24], -25],
    ["-26", [56, 25], -26],
    ["-100", [56, 99], -100],
    ["-1000", [57, 3, 231], -1000],
    ["-1000000", [58, 0, 15, 66, 63], -1000000],
    ["''", [96], ''],
    ["'a'", [97, 97], "a"],
    ["'IETF'", [100, 73, 69, 84, 70], "IETF"],
    [`'"\\'`, [98, 34, 92], `"\\`],
    ["'\u00fc'", [98, 195, 188], "\u00fc"],
    ["'\u6c34'", [99, 230, 176, 180], "\u6c34"],
    ["'\ud800\udd51'", [100, 240, 144, 133, 145], "\ud800\udd51"],
    ["'strea'+'ming'", [127, 101, 115, 116, 114, 101, 97, 100, 109, 105, 110, 103, 255], "streaming"],
    ["255-length string", [120, 255, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101, 97, 98, 99, 100, 101], "abcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcdeabcde"],
    ["[]", [128], []],
    ["['a', {'b': 'c'}]", [130, 97, 97, 161, 97, 98, 97, 99], ['a', { 'b': 'c' }]],
    ["['a, {_ 'b': 'c'}]", [130, 97, 97, 191, 97, 98, 97, 99, 255], ['a', { 'b': 'c' }]],
    ["[1,2,3]", [131, 1, 2, 3], [1, 2, 3]],
    ["[1, [2, 3], [4, 5]]", [131, 1, 130, 2, 3, 130, 4, 5], [1, [2, 3], [4, 5]]],
    ["[1, [2, 3], [_ 4, 5]]", [131, 1, 130, 2, 3, 159, 4, 5, 255], [1, [2, 3], [4, 5]]],
    ["[1, [_ 2, 3], [4, 5]]", [131, 1, 159, 2, 3, 255, 130, 4, 5], [1, [2, 3], [4, 5]]],
    ["[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]", [152, 25, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 24, 24, 25], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]],
    ["[_ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]", [159, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 24, 24, 25, 255], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]],
    ["[_ 1, [2, 3], [4, 5]]", [159, 1, 130, 2, 3, 130, 4, 5, 255], [1, [2, 3], [4, 5]]],
    ["[_ 1, [2, 3], [_ 4, 5]]", [159, 1, 130, 2, 3, 159, 4, 5, 255, 255], [1, [2, 3], [4, 5]]],
    ["[_ ]", [159, 255], []],
    ["{}", [160], {}],
    ["{'a': 1, 'b': [2, 3]}", [162, 97, 97, 1, 97, 98, 130, 2, 3], { 'a': 1, 'b': [2, 3] }],
    ["25-length object", [184, 26, 97, 48, 97, 97, 97, 49, 97, 97, 97, 50, 97, 97, 97, 51, 97, 97, 97, 52, 97, 97, 97, 53, 97, 97, 97, 54, 97, 97, 97, 55, 97, 97, 97, 56, 97, 97, 97, 57, 97, 97, 98, 49, 48, 97, 97, 98, 49, 49, 97, 97, 98, 49, 50, 97, 97, 98, 49, 51, 97, 97, 98, 49, 52, 97, 97, 98, 49, 53, 97, 97, 98, 49, 54, 97, 97, 98, 49, 55, 97, 97, 98, 49, 56, 97, 97, 98, 49, 57, 97, 97, 98, 50, 48, 97, 97, 98, 50, 49, 97, 97, 98, 50, 50, 97, 97, 98, 50, 51, 97, 97, 98, 50, 52, 97, 97, 98, 50, 53, 97, 97], { '0': 'a', '1': 'a', '2': 'a', '3': 'a', '4': 'a', '5': 'a', '6': 'a', '7': 'a', '8': 'a', '9': 'a', '10': 'a', '11': 'a', '12': 'a', '13': 'a', '14': 'a', '15': 'a', '16': 'a', '17': 'a', '18': 'a', '19': 'a', '20': 'a', '21': 'a', '22': 'a', '23': 'a', '24': 'a', '25': 'a' }],
    ["{'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D', 'e': 'E'}", [165, 97, 97, 97, 65, 97, 98, 97, 66, 97, 99, 97, 67, 97, 100, 97, 68, 97, 101, 97, 69], { 'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D', 'e': 'E' }],
    ["{_ 'a': 1, 'b': [_ 2, 3]}", [191, 97, 97, 1, 97, 98, 159, 2, 3, 255, 255], { 'a': 1, 'b': [2, 3] }],
    ["{_ 'Fun': true, 'Amt': -2}", [191, 99, 70, 117, 110, 245, 99, 65, 109, 116, 33, 255], { 'Fun': true, 'Amt': -2 }],
    ["false", [244], false],
    ["true", [245], true],
    ["null", [246], null],
    ["undefined", [247], undefined],
    ["Simple value 255", [248, 255], undefined],
    ["+Infinity", [250, 127, 128, 0, 0], Infinity],
    ["NaN", [250, 127, 192, 0, 0], NaN],
    ["-Infinity", [250, 255, 128, 0, 0], -Infinity],
    ["0.5", [250, 63, 0, 0, 0], 0.5],
    ["9007199254740994", [251, 67, 64, 0, 0, 0, 0, 0, 1], 9007199254740994],
    ["1.0e+300", [251, 126, 55, 228, 60, 136, 0, 117, 156], 1e+300],
    ["-9007199254740994", [251, 195, 64, 0, 0, 0, 0, 0, 1], -9007199254740994],
    ["h''", [0x40], new Uint8Array()],
    ["h'01020304'", [68, 1, 2, 3, 4], new Uint8Array([1, 2, 3, 4])],
    ["(_ h'0102', h'030405')", [95, 66, 1, 2, 67, 3, 4, 5, 255], new Uint8Array([1, 2, 3, 4, 5])],
];

const encode_cases = [
    ["0", [0], 0],
    ["1", [1], 1],
    ["10", [10], 10],
    ["23", [23], 23],
    ["24", [24, 24], 24],
    ["25", [24, 25], 25],
    ["100", [24, 100], 100],
    ["1000", [25, 3, 232], 1000],
    ["1000000", [26, 0, 15, 66, 64], 1000000],
    ["-1", [32], -1],
    ["-10", [41], -10],
    ["-24", [55], -24],
    ["-25", [56, 24], -25],
    ["-26", [56, 25], -26],
    ["-100", [56, 99], -100],
    ["-1000", [57, 3, 231], -1000],
    ["-1000000", [58, 0, 15, 66, 63], -1000000],
    ["''", [96], ''],
    ["'a'", [97, 97], "a"],
    ["'IETF'", [100, 73, 69, 84, 70], "IETF"],
    [`'"\\'`, [98, 34, 92], `"\\`],
    ["'\u00fc'", [98, 195, 188], "\u00fc"],
    ["'\u6c34'", [99, 230, 176, 180], "\u6c34"],
    ["'\ud800\udd51'", [100, 240, 144, 133, 145], "\ud800\udd51"],
    ["[]", [128], []],
    ["['a', {'b': 'c'}]", [130, 97, 97, 161, 97, 98, 97, 99], ['a', { 'b': 'c' }]],
    ["[1,2,3]", [131, 1, 2, 3], [1, 2, 3]],
    ["[1, [2, 3], [4, 5]]", [131, 1, 130, 2, 3, 130, 4, 5], [1, [2, 3], [4, 5]]],
    ["[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]", [152, 25, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 24, 24, 25], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]],
    ["{}", [160], {}],
    ["{'a': 1, 'b': [2, 3]}", [162, 97, 97, 1, 97, 98, 130, 2, 3], { 'a': 1, 'b': [2, 3] }],
    ["25-length object", [184, 26, 97, 48, 97, 97, 97, 49, 97, 97, 97, 50, 97, 97, 97, 51, 97, 97, 97, 52, 97, 97, 97, 53, 97, 97, 97, 54, 97, 97, 97, 55, 97, 97, 97, 56, 97, 97, 97, 57, 97, 97, 98, 49, 48, 97, 97, 98, 49, 49, 97, 97, 98, 49, 50, 97, 97, 98, 49, 51, 97, 97, 98, 49, 52, 97, 97, 98, 49, 53, 97, 97, 98, 49, 54, 97, 97, 98, 49, 55, 97, 97, 98, 49, 56, 97, 97, 98, 49, 57, 97, 97, 98, 50, 48, 97, 97, 98, 50, 49, 97, 97, 98, 50, 50, 97, 97, 98, 50, 51, 97, 97, 98, 50, 52, 97, 97, 98, 50, 53, 97, 97], { '0': 'a', '1': 'a', '2': 'a', '3': 'a', '4': 'a', '5': 'a', '6': 'a', '7': 'a', '8': 'a', '9': 'a', '10': 'a', '11': 'a', '12': 'a', '13': 'a', '14': 'a', '15': 'a', '16': 'a', '17': 'a', '18': 'a', '19': 'a', '20': 'a', '21': 'a', '22': 'a', '23': 'a', '24': 'a', '25': 'a' }],
    ["{'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D', 'e': 'E'}", [165, 97, 97, 97, 65, 97, 98, 97, 66, 97, 99, 97, 67, 97, 100, 97, 68, 97, 101, 97, 69], { 'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D', 'e': 'E' }],
    ["{ 'Fun': true, 'Amt': -2}", [162, 99, 70, 117, 110, 245, 99, 65, 109, 116, 33], { 'Fun': true, 'Amt': -2 }],
    ["false", [244], false],
    ["true", [245], true],
    ["null", [246], null],
    ["undefined", [247], undefined],
    ["+Infinity", [250, 127, 128, 0, 0], Infinity],
    ["NaN", [250, 127, 192, 0, 0], NaN],
    ["-Infinity", [250, 255, 128, 0, 0], -Infinity],
    ["0.5", [250, 63, 0, 0, 0], 0.5],
    ["9007199254740994", [251, 67, 64, 0, 0, 0, 0, 0, 1], 9007199254740994],
    ["1.0e+300", [251, 126, 55, 228, 60, 136, 0, 117, 156], 1e+300],
    ["-9007199254740994", [251, 195, 64, 0, 0, 0, 0, 0, 1], -9007199254740994],
    ["h''", [0x40], new Uint8Array()],
    ["h'01020304'", [68, 1, 2, 3, 4], new Uint8Array([1, 2, 3, 4])],
];

describe("CBOR", function () {
    decode_cases.forEach(c => {
        const bytes = new Uint8Array(c[1] as number[]);
        const json = c[2];
        it(`decode -> ${c[0]}`, function () {
            const decoded = CBOR.decode(bytes.buffer, true);
            expect(decoded)
                .toEqual(json);
        });
    });

    encode_cases.forEach(c => {
        const bytes = new Uint8Array(c[1] as number[]);
        const json = c[2];
        it(`encode -> ${c[0]}`, function () {
            const encoded = CBOR.encode(json, true);
            if (null === encoded) return fail();

            expect(new Uint8Array(encoded))
                .toEqual(bytes);
        });
        it(`encodeInto -> ${c[0]}`, function () {
            const encoded = CBOR.encodeInto(new ArrayBuffer(bytes.byteLength), json, true);
            if (null === encoded) return fail();

            expect(new Uint8Array(encoded))
                .toEqual(bytes);
        });
    })

    decode_cases.forEach(c => {
        const bytes = new Uint8Array(c[1] as number[]);
        const json = c[2];
        it(`decode NO THROW -> ${c[0]}`, function () {
            const decoded = CBOR.decode(bytes.buffer);
            expect(decoded)
                .toEqual(json);
        });
    });

    encode_cases.forEach(c => {
        const bytes = new Uint8Array(c[1] as number[]);
        const json = c[2];
        it(`encode NO THROW -> ${c[0]}`, function () {
            const encoded = CBOR.encode(json);
            if (null === encoded) return fail();

            expect(new Uint8Array(encoded))
                .toEqual(bytes);
        });
        it(`encodeInto NO THROW -> ${c[0]}`, function () {
            const encoded = CBOR.encodeInto(new ArrayBuffer(bytes.byteLength), json);
            if (null === encoded) return fail();

            expect(new Uint8Array(encoded))
                .toEqual(bytes);
        });
    })
});

import { OutOfBoundsError } from "../src/common/view";
import { ParseError, ErrorCode as ParseErrorCode } from "../src/decode/error";
//import { WriteError, ErrorCode as WriteErrorCode } from "../src/encode/error";

const parse_error_cases = [
    [`"['a', {'b': 'c'}" out of bounds`, [130, 97, 97, 161, 97, 98, 97], new OutOfBoundsError(8, 7)],
    [`"100" out of bounds`, [24], new OutOfBoundsError(2, 1)],
    [`"1000" out of bounds`, [25, 3], new OutOfBoundsError(3, 2)],
    [`"1000000" out of bounds`, [26, 0, 15, 66], new OutOfBoundsError(5, 4)],
    [`"-100" out of bounds`, [56], new OutOfBoundsError(2, 1)],
    [`"-1000" out of bounds`, [57, 3], new OutOfBoundsError(3, 2)],
    [`"-1000000" out of bounds`, [58, 0, 15, 66], new OutOfBoundsError(5, 4)],
    [`"0.5" out of bounds`, [250, 63, 0, 0], new OutOfBoundsError(5, 4)],
    [`"1.0e+300" out of bounds`, [251, 126, 55, 228, 60, 136, 0, 117], new OutOfBoundsError(9, 8)],
    [`64-bit int" unsupported`, [27], ParseError.build(ParseErrorCode.UNSUPPORTED_64_BIT)],
    [`64-bit uint unsupported`, [59], ParseError.build(ParseErrorCode.UNSUPPORTED_64_BIT)],
    [`64-bit size string unsupported`, [123], ParseError.build(ParseErrorCode.UNSUPPORTED_64_BIT)],
    [`64-bit size array unsupported`, [155], ParseError.build(ParseErrorCode.UNSUPPORTED_64_BIT)],
    [`64-bit size object unsupported`, [187], ParseError.build(ParseErrorCode.UNSUPPORTED_64_BIT)],
    // [`byte-string unsupported`, [64], ParseError.build(ParseErrorCode.UNSUPPORTED_BYTE_STRING)],
    [`half unsupported`, [249], ParseError.build(ParseErrorCode.UNSUPPORTED_HALF)],
];

//const write_error_cases = [
//    [`cannot encode function`, { "a": () => { } }, WriteError.build(WriteErrorCode.UNEXPECTED_TOKEN, { value: () => { } })]
//];

describe("CBOR errors", function () {
    parse_error_cases.forEach(c => {
        const bytes = new Uint8Array(c[1] as number[]);
        const error = c[2] as Error;
        it(`decode -> ${c[0]}`, function () {
            expect(() => {
                CBOR.decode(bytes.buffer, true);
                fail(`Expected error!`);
            }).toThrowError(error);
        });
    });

    //write_error_cases.forEach(c => {
    //    const json = c[1] as { [x: string]: any, [y: number]: any };
    //    const error = c[2] as Error;
    //    it(`encode -> ${c[0]}`, function () {
    //        expect(() => { CBOR.encode(json, true) })
    //            .toThrowError(error);
    //    });
    //    it(`encodeInto -> ${c[0]}`, function () {
    //        expect(() => { CBOR.encodeInto(new ArrayBuffer(1024), json, true) })
    //            .toThrowError(error);
    //    });
    //});
});