const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "development", // Doesn't minify
    devtool: false,
    entry: {
        content: path.join(__dirname, "app", "js", "content.js"),
        background: path.join(__dirname, "app", "js", "background.js"),
    },
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "[name].bundle.js"
    },
    module: {
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "app/images", to: "images" },
                { from: path.resolve(__dirname, "app/manifest.json") },
            ]
        })
    ]
}