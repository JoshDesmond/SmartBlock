const path = require("path");
const fs = require('fs');
const CopyPlugin = require("copy-webpack-plugin");

// First check if the images have been added, and cancel the build if not
const iconPath = './app/images/icon.png';
fs.access(iconPath, fs.F_OK, (err) => {
    if (err) {
        console.error(`${err}`);
        console.error(`File ${iconPath} does not exist. The images are not committed
            to the repository and for now must be copied over manually.`);
        return
    }
});


// Webpack Configuration
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
                { from: "app/css", to: "css" },
            ]
        })
    ]
}
