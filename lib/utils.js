escapeRegExp = function(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

const replaceAll = function (target, search, replacement) {
    return target.replace(new RegExp(escapeRegExp(search), 'g'), replacement);
};

const attr_config = {
    attr_start_text: "data-hexty",
    attr_start_html: "data-hexty-html",
    attr_start_md: "data-hexty-md",
    skip_suffix: "-x"
}

module.exports = {
    replaceAll: replaceAll,
    attr_config: attr_config
}