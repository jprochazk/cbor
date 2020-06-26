// Copyright (C) 2020 Jan Procházka. 
// This code is licensed under the MIT license. (see LICENSE for more details)

import { TextDecoder, TextEncoder } from 'util';
//@ts-ignore
window.TextDecoder = TextDecoder;
//@ts-ignore
window.TextEncoder = TextEncoder;
import { CBOR } from './../src/index';

// TODO: write error cases

const decode_cases = [
    ["PositiveIntegerFix 0", [0], 0],
    ["PositiveIntegerFix 1", [1], 1],
    ["PositiveIntegerFix 10", [10], 10],
    ["PositiveIntegerFix 23", [23], 23],
    ["PositiveIntegerFix 24", [24, 24], 24],
    ["PositiveInteger8 25", [24, 25], 25],
    ["PositiveInteger8 100", [24, 100], 100],
    ["PositiveInteger16 1000", [25, 3, 232], 1000],
    ["PositiveInteger32 1000000", [26, 0, 15, 66, 64], 1000000],
    ["NegativeIntegerFix -1", [32], -1],
    ["NegativeIntegerFix -10", [41], -10],
    ["NegativeIntegerFix -24", [55], -24],
    ["NegativeInteger8 -25", [56, 24], -25],
    ["NegativeInteger8 -26", [56, 25], -26],
    ["NegativeInteger8 -100", [56, 99], -100],
    ["NegativeInteger16 -1000", [57, 3, 231], -1000],
    ["NegativeInteger32 -1000000", [58, 0, 15, 66, 63], -1000000],
    ["String ''", [96], ''],
    ["String 'a'", [97, 97], "a"],
    ["String 'IETF'", [100, 73, 69, 84, 70], "IETF"],
    [`String '"\\'`, [98, 34, 92], `"\\`],
    ["String '\u00fc'", [98, 195, 188], "\u00fc"],
    ["String '\u6c34'", [99, 230, 176, 180], "\u6c34"],
    ["String '\ud800\udd51'", [100, 240, 144, 133, 145], "\ud800\udd51"],
    ["String 'streaming'", [127, 101, 115, 116, 114, 101, 97, 100, 109, 105, 110, 103, 255], "streaming"],
    ["Array []", [128], []],
    ["Array ['a', {'b': 'c'}]", [130, 97, 97, 161, 97, 98, 97, 99], ['a', { 'b': 'c' }]],
    ["Array ['a, {_ 'b': 'c'}]", [130, 97, 97, 191, 97, 98, 97, 99, 255], ['a', { 'b': 'c' }]],
    ["Array [1,2,3]", [131, 1, 2, 3], [1, 2, 3]],
    ["Array [1, [2, 3], [4, 5]]", [131, 1, 130, 2, 3, 130, 4, 5], [1, [2, 3], [4, 5]]],
    ["Array [1, [2, 3], [_ 4, 5]]", [131, 1, 130, 2, 3, 159, 4, 5, 255], [1, [2, 3], [4, 5]]],
    ["Array [1, [_ 2, 3], [4, 5]]", [131, 1, 159, 2, 3, 255, 130, 4, 5], [1, [2, 3], [4, 5]]],
    ["Array [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]", [152, 25, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 24, 24, 25], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]],
    ["Array [_ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]", [159, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 24, 24, 25, 255], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]],
    ["Array [_ 1, [2, 3], [4, 5]]", [159, 1, 130, 2, 3, 130, 4, 5, 255], [1, [2, 3], [4, 5]]],
    ["Array [_ 1, [2, 3], [_ 4, 5]]", [159, 1, 130, 2, 3, 159, 4, 5, 255, 255], [1, [2, 3], [4, 5]]],
    ["Array [_ ]", [159, 255], []],
    ["Object {}", [160], {}],
    ["Object {'a': 1, 'b': [2, 3]}", [162, 97, 97, 1, 97, 98, 130, 2, 3], { 'a': 1, 'b': [2, 3] }],
    ["Object {'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D', 'e': 'E'}", [165, 97, 97, 97, 65, 97, 98, 97, 66, 97, 99, 97, 67, 97, 100, 97, 68, 97, 101, 97, 69], { 'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D', 'e': 'E' }],
    ["Object {_ 'a': 1, 'b': [_ 2, 3]}", [191, 97, 97, 1, 97, 98, 159, 2, 3, 255, 255], { 'a': 1, 'b': [2, 3] }],
    ["Object {_ 'Fun': true, 'Amt': -2}", [191, 99, 70, 117, 110, 245, 99, 65, 109, 116, 33, 255], { 'Fun': true, 'Amt': -2 }],
    ["false", [244], false],
    ["true", [245], true],
    ["null", [246], null],
    ["undefined", [247], undefined],
    ["UnassignedSimpleValue 255", [248, 255], undefined],
    ["Float32 +Infinity", [250, 127, 128, 0, 0], Infinity],
    ["Float32 NaN", [250, 127, 192, 0, 0], NaN],
    ["Float32 -Infinity", [250, 255, 128, 0, 0], -Infinity],
    ["Float32 0.5", [250, 63, 0, 0, 0], 0.5],
    ["Float64 9007199254740994", [251, 67, 64, 0, 0, 0, 0, 0, 1], 9007199254740994],
    ["Float64 1.0e+300", [251, 126, 55, 228, 60, 136, 0, 117, 156], 1e+300],
    ["Float64 -9007199254740994", [251, 195, 64, 0, 0, 0, 0, 0, 1], -9007199254740994],
];

const encode_cases = [
    ["PositiveIntegerFix 0", [0], 0],
    ["PositiveIntegerFix 1", [1], 1],
    ["PositiveIntegerFix 10", [10], 10],
    ["PositiveIntegerFix 23", [23], 23],
    ["PositiveIntegerFix 24", [24, 24], 24],
    ["PositiveInteger8 25", [24, 25], 25],
    ["PositiveInteger8 100", [24, 100], 100],
    ["PositiveInteger16 1000", [25, 3, 232], 1000],
    ["PositiveInteger32 1000000", [26, 0, 15, 66, 64], 1000000],
    ["NegativeIntegerFix -1", [32], -1],
    ["NegativeIntegerFix -10", [41], -10],
    ["NegativeIntegerFix -24", [55], -24],
    ["NegativeInteger8 -25", [56, 24], -25],
    ["NegativeInteger8 -26", [56, 25], -26],
    ["NegativeInteger8 -100", [56, 99], -100],
    ["NegativeInteger16 -1000", [57, 3, 231], -1000],
    ["NegativeInteger32 -1000000", [58, 0, 15, 66, 63], -1000000],
    ["String ''", [96], ''],
    ["String 'a'", [97, 97], "a"],
    ["String 'IETF'", [100, 73, 69, 84, 70], "IETF"],
    [`String '"\\'`, [98, 34, 92], `"\\`],
    ["String '\u00fc'", [98, 195, 188], "\u00fc"],
    ["String '\u6c34'", [99, 230, 176, 180], "\u6c34"],
    ["String '\ud800\udd51'", [100, 240, 144, 133, 145], "\ud800\udd51"],
    ["Array []", [128], []],
    ["Array ['a', {'b': 'c'}]", [130, 97, 97, 161, 97, 98, 97, 99], ['a', { 'b': 'c' }]],
    ["Array [1,2,3]", [131, 1, 2, 3], [1, 2, 3]],
    ["Array [1, [2, 3], [4, 5]]", [131, 1, 130, 2, 3, 130, 4, 5], [1, [2, 3], [4, 5]]],
    ["Array [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]", [152, 25, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 24, 24, 25], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]],
    ["Object {}", [160], {}],
    ["Object {'a': 1, 'b': [2, 3]}", [162, 97, 97, 1, 97, 98, 130, 2, 3], { 'a': 1, 'b': [2, 3] }],
    ["Object {'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D', 'e': 'E'}", [165, 97, 97, 97, 65, 97, 98, 97, 66, 97, 99, 97, 67, 97, 100, 97, 68, 97, 101, 97, 69], { 'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D', 'e': 'E' }],
    ["Object { 'Fun': true, 'Amt': -2}", [162, 99, 70, 117, 110, 245, 99, 65, 109, 116, 33], { 'Fun': true, 'Amt': -2 }],
    ["false", [244], false],
    ["true", [245], true],
    ["null", [246], null],
    ["undefined", [247], undefined],
    ["Float32 +Infinity", [250, 127, 128, 0, 0], Infinity],
    ["Float32 NaN", [250, 127, 192, 0, 0], NaN],
    ["Float32 -Infinity", [250, 255, 128, 0, 0], -Infinity],
    ["Float32 0.5", [250, 63, 0, 0, 0], 0.5],
    ["Float64 9007199254740994", [251, 67, 64, 0, 0, 0, 0, 0, 1], 9007199254740994],
    ["Float64 1.0e+300", [251, 126, 55, 228, 60, 136, 0, 117, 156], 1e+300],
    ["Float64 -9007199254740994", [251, 195, 64, 0, 0, 0, 0, 0, 1], -9007199254740994],
];

describe("CBOR", function () {
    decode_cases.forEach(c => {
        const bytes = new Uint8Array(c[1] as number[]);
        const json = c[2];
        it(`decode ${c[0]}`, function () {
            const decoded = CBOR.decode(bytes.buffer, true);
            expect(decoded)
                .toEqual(json);
        });
    });

    encode_cases.forEach(c => {
        const bytes = new Uint8Array(c[1] as number[]);
        const json = c[2];
        it(`encode ${c[0]}`, function () {
            {
                const encoded = CBOR.encode(json, true);
                if (null === encoded) return fail();

                expect(new Uint8Array(encoded))
                    .toEqual(bytes);
            }

            {
                const encoded = CBOR.encodeInto(json, new ArrayBuffer(bytes.byteLength), true);
                if (null === encoded) return fail();

                expect(new Uint8Array(encoded))
                    .toEqual(bytes);
            }
        });
    })
});