const merge = require("webpack-merge");
const webpack_common = require("./webpack.common.js");

module.exports = merge(webpack_common, {
    mode: "production",
});
