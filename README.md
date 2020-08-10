# cbor

JavaScript implementation of the CBOR [RFC 7049](https://tools.ietf.org/html/rfc7049).

![David](https://img.shields.io/david/dev/jprochazk/cbor)
![GitHub](https://img.shields.io/github/license/jprochazk/cbor)

### Usage

This library is meant for use in the browser, but will also work in Node.

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

The allocation strategy should be good enough for most uses, 
but nothing beats encoding into a pre-allocated buffer:
```js
// Allocate a 64 byte buffer
const buffer = new ArrayBuffer(64);
// Encode the data into this buffer
const encoded = CBOR.encodeInto(data, buffer);
```
If you're always receiving the same data, make use of this!
Encode your data once, measure the encoded length, and always
pre-allocate this buffer size.

### Benchmarks

Speed was one of my main concerns when writing this library. The source code of the benchmark is available [here](https://github.com/jprochazk/cbor-benchmark). Here are the results:

 _ _ _ _
| CPU | CBOR.encode | CBOR.encodeInto | CBOR.decode |
 _ _ _ _
| i5-8600K | 2.8571 ms | 0.6223 ms | 1.1312 ms |
 _ _ _ _
| i7-8700K | 2.6581 ms | 0.6167 ms | 1.0576 ms |
 _ _ _ _
| i7-9850H | 2.1372 ms | 0.5422 ms | 0.8610 ms |
 _ _ _ _
| i7-4510U | 4.1245 ms | 0.9720 ms | 1.3037 ms |

The JSON object used is ~13KB decoded, ~6KB encoded. This means 13MB/s decoding speed and around 2.3MB/s encoding. Most of the encoding here is spent allocating extra space, so if you encode into a sufficiently large pre-allocated buffer, you're looking at an encoding speed of nearly 8.5MB/s.

### Notes

There are a few things from the specification which are currently unimplemented:

-   Byte strings
-   Tags, and the items they represent:
    -   date/time, bignum/bigfloat as byte string, and others
-   16-bit float (IEEE754 binary16)
-   Integers larger than 32 bit (BigInt)

These weren't required in my case, but they're pretty trivial to add. If you need one or more of these features, submit an [issue](https://github.com/jprochazk/cbor/issues).
