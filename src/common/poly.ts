

const _encoder = globalThis.TextEncoder || require("util").TextEncoder;
const _decoder = globalThis.TextDecoder || require("util").TextDecoder;

export {
    _encoder as TextEncoder,
    _decoder as TextDecoder
}