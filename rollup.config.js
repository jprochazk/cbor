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
            { exports: "default", file: pkg.main, format: "cjs" },
            { file: pkg.module, format: "es" },
            { name: "CBOR", file: pkg.browser, format: "umd" },
        ],
    },
];
