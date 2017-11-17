const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio')

module.exports = (CONFIG) => {

    const replaceAll = function (target, search, replacement) {
        return target.replace(new RegExp(search, 'g'), replacement);
    };

    const injectText = function (html, attr_key, value) {
        const $ = cheerio.load(html)
        const original_text_element = $(`[${CONFIG.config.attr_start}="${attr_key}"]`).first().toString();
        const new_text_element = $(`[${CONFIG.config.attr_start}="${attr_key}"]`).first().text(value).toString();
        return {
            original_text_element: original_text_element,
            new_text_element: new_text_element
        }
    }

    const textly = function (files) {
        files.forEach((file) => {
            fs.readFile(file.path, 'utf8', (err, html) => {
                let placeholders = [];
                const $ = cheerio.load(html)
                text = require(file.text_path)
                for (var placeholder in text) {
                    placeholders.push(placeholder);
                    if (text.hasOwnProperty(placeholder)) {
                        const t = injectText(html, placeholder, text[placeholder]);
                        html = replaceAll(html, t.original_text_element, t.new_text_element);
                    }
                }
                fs.writeFile(file.path, html, 'utf8', (err) => {
                    if (err) throw err;
                    console.log(placeholders.join(" , "), "has been replaced - file:", file.path);
                });
            });
        });
    }

    textly(CONFIG.files);
    
};