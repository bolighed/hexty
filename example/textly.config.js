const path = require('path');

const files = [
    {
        path: path.resolve(__dirname, "./index.html"),
        text_path: path.resolve(__dirname, "./index.texts.js")
    }
];

const config = {
    attr_start: "data-texty"
}

module.exports = {
    files: files,
    config: config
};