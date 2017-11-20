# Hexty
A minimalistic tool for text replacement in HTML.

## Install

```sh
npm i hexty -D
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

const config = {
    attr_start: "data-texty"
}

module.exports = {
    files: files,
    config: config
};
```

let's create the `index.texts.js` file, which is a map of placeholder and text files

`index.texts.js`
```js
const texts = {
    "hello-message": "Hello World"
}

module.exports = texts;
```

the html contains a p tag with attribute data-textly with value `hello-message` matching the key in `index.texts.js`.

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

        <p data-texty="hello-message">Hello World</p>

    </body>
</html>

```

At last, let's create the `index.js` file that glues everything together

`index.js`
```js
const config = require('./textly.config');
const textly = require('../index.js')(config);
```
