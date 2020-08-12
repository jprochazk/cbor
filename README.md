# cbor

[![Build Status](https://travis-ci.com/jprochazk/cbor.svg?branch=master)](https://travis-ci.com/jprochazk/cbor)
[![David](https://img.shields.io/david/dev/jprochazk/cbor)](https://github.com/jprochazk/cbor/blob/master/package.json)
[![GitHub](https://img.shields.io/github/license/jprochazk/cbor)](https://github.com/jprochazk/cbor/blob/master/LICENSE)

TypeScript implementation of the Concise Binary Object Representation [RFC 7049](https://tools.ietf.org/html/rfc7049). From the [official website](http://cbor.io/):

CBOR is a data format whose design goals include the possibility of extremely small code size, fairly small message size, and extensibility without the need for version negotiation.

The API is self-explanatory:
```js
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
const decoded = CBOR.decode(encoded); // Object

// You can also encode into a pre-allocated buffer
const encoded = CBOR.encodeInto(new ArrayBuffer(4096), data);
```

### Usage

The library is targeted for both Node and Browsers using NPM:
```
> npm install cbor@npm:jprochazk/cbor
```
This install the library under the `cbor` alias.

```js
// as CommonJS
const CBOR = require("cbor");

// as an ES module
import CBOR from "cbor";

CBOR.encode(...);
CBOR.decode(...);
```

Or included in the page as a static script from the `unkpg` CDN:

```html
<script src="https://unpkg.com/@jprochazk/cbor@0.4.6"></script>
<script>
    // after including the script in the page, the CBOR object is available globally
    CBOR.encode(...);
    CBOR.decode(...);
</script>
```

### Benchmarks

Speed was one of my main concerns when writing this library. Benchmark is available [here](https://jsbench.me/krkdop8101/1).

| Browser | CBOR.decode | CBOR.encode | CBOR.encodeInto |
| :------ | :---------- | :---------- | :-------------- |
| Chrome  | 5225 ops/s  | 8998 ops/s  | 9268 ops/s      |
| Firefox | 20454 ops/s | 22323 ops/s | 22900 ops/s     |

Results are on a i5-8600k intel processor. Your mileage may vary. The JSON data used in the test is 2 KB decoded and 1.8 KB encoded. I specifically chose this data, because it encodes badly (lots of nested objects with only a single property).

The benchmark suggests the library can decode at 13 MB/s and encode at 10 MB/s in Chrome, and around 2.5~4x as much in Firefox. I haven't run the benchmarks in Safari, because I don't have access to any Apple computers.

### Notes

Because of the ArrayBuffer allocation strategy, the CBOR.encode method is pretty much as fast as CBOR.encodeInto. However, you can still find performance gains when encoding very large objects by preallocating a much larger buffer, or when encoding very small objects (<128 bytes) by allocating a smaller buffer.

Minimum supported Node version is 11.

There are a few things from the specification which are currently unimplemented:

-   Byte strings
-   Tags, and the items they represent:
    -   date/time, bignum/bigfloat as byte string, and others
-   16-bit float (IEEE754 binary16)
-   Integers larger than 32 bit (BigInt)

If you need one or more of these features, submit an [issue](https://github.com/jprochazk/cbor/issues).
