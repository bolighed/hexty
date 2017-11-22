# Hexty
A minimalistic tool for text replacement in HTML.

## Install

```sh
npm i bolighed-hexty -D
```

## Example

There is a working example in the `example` folder.


Let's create the config file. It will contains the config object and the files list, both constants must be exported, like in the example.


For example in this case the `index.html` page will use the `index.texts.js` file.

`textly.config.js`
```js
const path = require('path');

const files = [
    {
        path: path.resolve(__dirname, "./index.html"),
        text_path: path.resolve(__dirname, "./index.texts.js")
    }
];

module.exports = files;
```

Let's create the `index.texts.js` file, which is a map of placeholder and text files

`index.texts.js`
```js
const texts = {
    "message-text": "Hello World in a text",
    "message-html": "<h2>Something else in good old html</h2>",
    "another-section-html": "<h2>another section</h2>",
    "message-md": "### hello this is markdown ++"
}

module.exports = texts;
```

The html tags with attribute `data-textly` having values matching the keys in `index.texts.js`. It is important if your text contains HTML your key must finish with `-html` and if contains Markdown it must finish `-md`.

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>

<body>
    <h1>Texty example</h1>
    <p data-texty="message-text">Hello World in a text</p>
    <p data-texty="message-text">Hello World in a text</p>
    <li data-texty="message-html" class="plum"><h2>Something else in good old html</h2></li>
    <li data-texty="message-html" class="plum"><h2>Something else in good old html</h2></li>
    <li data-texty="message-md" class="plum"><h3>hello this is markdown ++</h3></li>
    <li data-texty="message-md" class="plum"><h3>hello this is markdown ++</h3></li>
</body>

</html>
```

At last, let's create the `index.js` file that glues everything together.

`index.js`
```js
const config = require('./textly.config');
const textly = require('bolighed-hexty')(config);
```
