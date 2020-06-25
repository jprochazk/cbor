const path = require("path");

module.exports = {
    entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.worker\.js$/,
                use: {
                    loader: "worker-loader",
                    options: {
                        inline: true,
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
        modules: [path.resolve("./src"), path.resolve("./node_modules")],
    },
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "build"),
    },
};
