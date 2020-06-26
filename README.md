# cbor

JavaScript implementation of the CBOR [RFC 7049](https://tools.ietf.org/html/rfc7049).

![David](https://img.shields.io/david/dev/jprochazk/cbor)
![GitHub](https://img.shields.io/github/license/jprochazk/cbor)

### Usage

This library is meant for use in the browser, but will also work in Node.

```
> npm install @jprochazk/cbor
```

The API is very simple:

```js
import CBOR from "@jprochazk/cbor";

const json = {
    "key": "value",
    "another key": [
        1, 2, 3
    ],
    "number": 3.141592653589793
    "nulls are also encoded": null
};

// ArrayBuffer(51)
const encoded = CBOR.encode(json);

// { "key": "value", "another key": [1, 2, 3], "number": 3.14159265359, "nulls are also encoded": null}
const decoded = CBOR.decode(encoded);
console.log(decoded.key); // value
console.log(decoded.number); // 3.1415927410125732
```

You can also encode into a pre-allocated ArrayBuffer.
```js
// Allocate a 64 byte buffer
const buffer = new ArrayBuffer(64);
// Encode the data into this buffer
const encoded = CBOR.encodeInto(data, buffer);
```

### Notes

There are a few things from the specification which are currently unimplemented:

-   Byte strings
-   Tags, and the items they represent:
    -   date/time, bignum/bigfloat as byte string, and others
-   16-bit float (IEEE754 binary16)
-   Integers larger than 32 bit (BigInt)

These weren't required in my case, but if you need one or more of these features, submit an [issue](https://github.com/jprochazk/cbor/issues), and I'll implement it! :)
