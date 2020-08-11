

const _encoder = TextEncoder || require("util").TextEncoder;
const _decoder = TextDecoder || require("util").TextDecoder;

export {
    _encoder as TextEncoder,
    _decoder as TextDecoder
}