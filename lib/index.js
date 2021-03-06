const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const marked = require('marked');
const _ = require('lodash');
const colors = require('colors');
const { replaceAll, attr_config } = require('./utils');

const renderer = new marked.Renderer();
renderer.heading = function(text, level) {
    return `<h${level} >${text}</h${level}>`;
};

module.exports = (files) => {

    // const inject = function (type, html, attr_key, value) {
    //     const $ = cheerio.load(html)
    //     if (type === 'md') {
    //         value = marked(value, { renderer: renderer })
    //     }
    //     const original_text_element = $(`[${attr_config.attr_start_text}="${attr_key}"]`).first().toString()
    //     return {
    //         original_text_element: original_text_element,
    //         new_text_element: $(`[${attr_config.attr_start_text}="${attr_key}"]`).first().html(value).toString(),
    //         original_text_element_empty: cheerio(original_text_element).empty().toString()
    //     }
    // }

    const inject = function (type, html, attr_key, value) {
        const $ = cheerio.load(html)
        if (type === 'md') {
            value = marked(value, { renderer: renderer })
        }
        $(`[${attr_config.attr_start_text}="${attr_key}"]`).toArray().forEach((element) => {
            const original_text_element = $(element).toString();
            html = replaceAll(html, original_text_element, $(`[${attr_config.attr_start_text}="${attr_key}"]`).first().html(value).toString());
        });

        return html;
    }

    const findPlaceholdersINHTML = function(html) {
        const $ = cheerio.load(html);
        let placeholders = [];
        $(`*`).filter((i,e) => {
            const t = $(e).attr(`${attr_config.attr_start_text}`);
            if (t && placeholders.indexOf(t) === -1) {
                placeholders.push(t);
            }
        })
        return placeholders;
    }

    const filterSkippedAway = function(placeholders) {
        return placeholders.filter((placeholder) => {
            return !placeholder.endsWith(attr_config.skip_suffix)
        });
    }

    const hexty = function (files) {
        files.forEach((file) => {

            fs.readFile(file.path, 'utf8', (err, html) => {

                let placeholders_in_HTML = findPlaceholdersINHTML(html)

                let placeholders = [];
                let placeholder_empty = [];
                let text;
                if (typeof file.text_path === 'string') {
                    text = require(file.text_path);
                } else {
                    text = file.text_path
                }

                for (const placeholder in text) {
                    if (text.hasOwnProperty(placeholder) && !placeholder.endsWith(attr_config.skip_suffix)) {
                        if (text[placeholder] !== "") {
                            placeholders.push(placeholder);
                            let t;
                            if (placeholder.endsWith('-html')) {
                                html = inject("html", html, placeholder, text[placeholder]);
                            } else if (placeholder.endsWith('-md')) {
                                html = inject("md", html, placeholder, text[placeholder]);
                            } else {
                                html = inject("", html, placeholder, text[placeholder]);
                            }
                        } else {
                            placeholder_empty.push(placeholder);
                        }
                    }
                }

                const t = filterSkippedAway(_.difference(placeholders_in_HTML, Object.keys(text)));
                const q = filterSkippedAway(_.difference(Object.keys(text), placeholders_in_HTML));
                const placeholder_empty_not_skipped = filterSkippedAway(placeholder_empty);

                console.log(`HTML file: ${file.path}`);
                if (typeof file.text_path === 'string') {
                    console.log(`TEXT file: ${file.text_path}...\n`);
                } else {
                    console.log(`TEXT file: ${JSON.stringify(file.text_path).substring(0,35)}...\n`);
                }

                if (t.length > 0) {
                    console.log(`Found those placeholders in html but not in text:\n`.red+`${t.join("\n")}`,"\n");
                }
                if (q.length > 0) {
                    console.log(`Found those placeholders in text but not in html:\n`.red+`${q.join("\n")}`,"\n");
                }
                if (placeholder_empty_not_skipped.length > 0) {
                    console.log(`Found those placeholders in text but they are empty, therefore will this placeholder will not be replaced even if present in the HTML:\n`.red+`${placeholder_empty_not_skipped.join("\n")}`,"\n");
                }

                if ((t.length + q.length + placeholder_empty_not_skipped.length) > 0) {
                    console.log("ERROR: no placeholders relplaced, no files written\nExited with code 1".red);
                } else {
                    const placeholders_replaced = _.intersection(placeholders, placeholders_in_HTML);
                    try {
                        fs.writeFileSync(file.path, html, 'utf8');
                        console.log("writing");
                        console.log(`REPLACED:\n${placeholders_replaced.join("\n")}\n\n`.green);
                    } catch (error) {
                        console.log("Error", error)   
                    }
                }

            });

        });
    }

    hexty(files);
    
};