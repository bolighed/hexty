const path = require('path');
const { texts, texts2 } = require("./index.texts.js");

const files = [
    {
        path: path.resolve(__dirname, "./index.html"),
        text_path: texts
    },
    {
        path: path.resolve(__dirname, "./another.html"),
        text_path: path.resolve(__dirname, "./another.texts.js")
    }
];

module.exports = files;