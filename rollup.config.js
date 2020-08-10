//import resolve from "@rollup/plugin-node-resolve";
//import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";

export default [
    // UMD, CJS, ESM
    {
        input: "src/index.ts",
        plugins: [
            typescript({
                typescript: require("typescript"),
            }),
        ],
        output: [
            { name: "cbor", file: pkg.main, format: "cjs" },
            { name: "cbor", file: pkg.module, format: "es" },
            { name: "cbor", file: pkg.browser, format: "umd" },
        ],
    },
];
