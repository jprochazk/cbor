const path = require("path");
const merge = require("webpack-merge");
const webpack_common = require("./webpack.common.js");

module.exports = merge(webpack_common, {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        contentBase: path.resolve(__dirname, "public"),
        port: 8080,
        hot: false,
    },
});
