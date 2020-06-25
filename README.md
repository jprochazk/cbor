# cbor

JavaScript implementation of the CBOR [RFC 7049](https://tools.ietf.org/html/rfc7049). Decoding is implemented as a [SAX](https://en.wikipedia.org/wiki/Simple_API_for_XML) parser.

This library provides the [recommended API](http://cbor.io/impls.html)

```js
import CBOR from "cbor";

const encoded = CBOR.encode(json);
const decoded = CBOR.decode(encoded);
```

### Notes

There are a few things from the specification which are currently unimplemented:

-   Byte strings
-   Tags, and the items they represent:
    -   date/time, bignum/bigfloat as byte string, and others
-   16-bit float (IEEE754 binary16)

These weren't required in my case, but if you need one or more of these features, submit an [issue](https://github.com/jprochazk/cbor/issues), and I'll implement it! :)

### Acknowledgements

The values for the test cases are from https://github.com/paroga/cbor-js/blob/master/test/tests.js. © 2015 Patrick Gansterer, MIT.
