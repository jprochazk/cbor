# cbor

JavaScript implementation of the CBOR [RFC 7049](https://tools.ietf.org/html/rfc7049).

![David](https://img.shields.io/david/dev/jprochazk/cbor)
![GitHub](https://img.shields.io/github/license/jprochazk/cbor)

### Usage

```
> npm install cbor@npm:jprochazk/cbor
```

The above command will install the library under the `cbor` alias.

The API is very simple:

```js
import CBOR from "cbor";

const json = {
    "key": "value",
    "another key": [
        1, 2, 3
    ],
    "number": 3.141592653589793
    "nulls are also encoded": null
};

const encoded = CBOR.encode(json);
const decoded = CBOR.decode(encoded);
```

You can also encode into a pre-allocated buffer.
```js
// Allocate a 4KiB buffer
const buffer = new ArrayBuffer(4096);
// Encode the data into this buffer
const encoded = CBOR.encodeInto(data, buffer);
```

### Benchmarks

Speed was one of my main concerns when writing this library. The source code of the benchmark is available [here](https://github.com/jprochazk/cbor-benchmark). Here are the results:


| CPU      | CBOR.encode | CBOR.encodeInto | CBOR.decode |
| :------- | :---------- | :-------------- | :---------- |
| i5-8600K | 0.6555 ms   | 0.5743 ms       | 1.1312 ms   |

The JSON object used is ~13KB decoded, ~6KB encoded. This means ~13MB/s decoding speed and ~10MB/s encoding speed.

You can squeeze out a bit more performance if you use `CBOR.encodeInto` with a sufficiently large buffer. the `CBOR.encode` default is 1024 bytes, which should be enough for the vast majority of uses, but if you ever find yourself using more than that, utilize `CBOR.encodeInto`.

### Notes

This library is meant for use in the browser. Node support is in the works.

There are a few things from the specification which are currently unimplemented:

-   Byte strings
-   Tags, and the items they represent:
    -   date/time, bignum/bigfloat as byte string, and others
-   16-bit float (IEEE754 binary16)
-   Integers larger than 32 bit (BigInt)

These weren't required in my case, but they're trivial additions to the existing parser/writer logic. If you need one or more of these features, submit an [issue](https://github.com/jprochazk/cbor/issues).
