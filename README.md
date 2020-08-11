# cbor

JavaScript implementation of the CBOR [RFC 7049](https://tools.ietf.org/html/rfc7049).

[![Build Status](https://travis-ci.com/jprochazk/cbor.svg?branch=master)](https://travis-ci.com/jprochazk/cbor)
[![David](https://img.shields.io/david/dev/jprochazk/cbor)](https://github.com/jprochazk/cbor/blob/master/package.json)
[![GitHub](https://img.shields.io/github/license/jprochazk/cbor)](https://github.com/jprochazk/cbor/blob/master/LICENSE)

### Usage

```
> npm install cbor@npm:jprochazk/cbor
```

The above command will install the library under the `cbor` alias.

The API is self-explanatory:
```js
import CBOR from "cbor";

// Initialize some data
const json = {
    "key": "value",
    "another key": [
        1, 2, 3
    ],
    "number": 3.141592653589793
    "nulls are also encoded": null
};

const encoded = CBOR.encode(json); // ArrayBuffer
const decoded = CBOR.decode(encoded); // { ... }

// You can also encode into a pre-allocated buffer
const buffer = new ArrayBuffer(4096);
const encoded = CBOR.encodeInto(data, buffer);
```

### Benchmarks

Speed was one of my main concerns when writing this library. Benchmark is available [here](https://jsbench.me/krkdop8101/1).


| Browser | CBOR.decode | CBOR.encode | CBOR.encodeInto |
| :------ | :---------- | :---------- | :-------------- |
| Chrome  | 5225 ops/s  | 8998 ops/s  | 9268 ops/s      |
| Firefox | 20454 ops/s | 22323 ops/s | 22900 ops/s     |

Results are on a i5-8600k intel processor. The JSON data used in the test is 2 KB decoded and 1.8 KB encoded. This means the library can decode at 13 MB/s and encode at 10 MB/s in Chrome, and around 2.5~4x as much in Firefox. 

You can squeeze out a bit more performance if you use `CBOR.encodeInto` with a sufficiently large buffer. the `CBOR.encode` default is 1024 bytes, which should be enough for the vast majority of uses, but if you ever find yourself using more than that, utilize `CBOR.encodeInto`.

### Notes

This library is meant for use in both Node & browsers. Minimum supported Node version is 11.

There are a few things from the specification which are currently unimplemented:

-   Byte strings
-   Tags, and the items they represent:
    -   date/time, bignum/bigfloat as byte string, and others
-   16-bit float (IEEE754 binary16)
-   Integers larger than 32 bit (BigInt)

If you need one or more of these features, submit an [issue](https://github.com/jprochazk/cbor/issues).
