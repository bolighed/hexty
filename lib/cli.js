#!/usr/bin/env node

const hexty = require('./index');
const yargs = require('yargs');
const path = require('path');

function cli() {

    const argv_config = yargs
    .options({
        config: {
            alias: 'c',
            describe: 'Configuration file',
            type: 'string',
        }
    })
    .help()
    .argv

    if (argv_config) {
        try {
            files = require(path.resolve(argv_config.config));
            hexty(files);
        } catch (error) {
            console.log(error.toString());
        }
    }
}

cli()