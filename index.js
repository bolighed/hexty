const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const marked = require('marked');
const { replaceAll, attr_config } = require('./libs/utils');

const renderer = new marked.Renderer();
renderer.heading = function(text, level) {
    return `<h${level} >${text}</h${level}>`;
};

module.exports = (files) => {

    const inject = function (type, html, attr_key, value) {
        const $ = cheerio.load(html)
        if (type === 'md') {
            value = marked(value, { renderer: renderer })
        }
        return {
            original_text_element: $(`[${attr_config.attr_start_text}="${attr_key}"]`).first().toString(),
            new_text_element: $(`[${attr_config.attr_start_text}="${attr_key}"]`).first().html(value).toString()
        }
    }

    const hexty = function (files) {
        files.forEach((file) => {
            fs.readFile(file.path, 'utf8', (err, html) => {
                let placeholders = [];
                text = require(file.text_path)
                for (const placeholder in text) {
                    if (text.hasOwnProperty(placeholder)) {
                        let t;
                        if (placeholder.endsWith('-html')) {
                            t = inject("html", html, placeholder, text[placeholder]);
                        } else if (placeholder.endsWith('-md')) {
                            t = inject("md", html, placeholder, text[placeholder]);
                        } else {
                            t = inject("", html, placeholder, text[placeholder]);
                        }
                        html = replaceAll(html, t.original_text_element, t.new_text_element);
                    }
                    placeholders.push(placeholder);
                }
                fs.writeFile(file.path, html, 'utf8', (err) => {
                    if (err) throw err;
                    console.log(placeholders.join(" , "), "has been replaced - file:", file.path);
                });
            });
        });
    }

    hexty(files);
    
};