#!/usr/bin/env node
'use strict'

const yargs = require("yargs");
const { hideBin } = require('yargs/helpers')
const getenv = require('getenv')

function main() {
    var argv = yargs(hideBin(process.argv))

        .middleware((yargs) => {
            return {}
        })

        .options({
            'help': {
                description: 'Show usage instructions.',
                alias: 'h'
            },
        })

        //.showHelpOnFail(false)
        .help( 'help', 'Show usage instructions.')
        .command({command: '*', handler() {yargs.showHelp()} })

        // '-' => remove
        .command(
            ['remove [dirs...]', '-', 'rm'], 'remove dirs from PATH variable', 
            // build sub command options here
            (yargs) => {},
            // the actual command implementation
            (yargs) => remove({patterns: yargs.dirs})
        )

        // '$' => :append
        .command(
            ['append [dirs...]', '$'], 'append dirs to PATH variable', 
            // build sub command options here
            (yargs) => {},
            // the actual command implementation
            (yargs) => console.log(append({dirs: yargs.dirs})),
        )

        // '^' => :prepand
        .command(
            ['prepend [dirs...]', '^', '+'], 'prepend dirs to PATH variable', 
            // build sub command options here
            (yargs) => {},
            // the actual command implementation
            (yargs) => console.log(prepend({dirs: yargs.dirs})),
        )

        // clean path return
        .command(
            ['clean', '$0'], 'echos path cleaned from duplicated', 
            // build sub command options here
            (yargs) => {},
            // the actual command implementation
            (yargs) => clean()
        )

        //.parse()
        .wrap(yargs.terminalWidth())
        .argv
}

// ./pathfix.js clean
function clean() {
    const dirs = getenv('PATH').split(':')
    const path = dirs.filter((e,idx) => dirs.indexOf(e) === idx).join(':')
    console.log(path)
}

// ./pathfix remove ruby
function remove({patterns}) {
    var path = getenv('PATH').split(':')
    patterns.forEach((pattern) => path = path.filter((e) => !e.match(pattern)))
    console.log(path.join(':'))
}

// ./pathfix prepend /some/path
const prepend = ({dirs}) => getenv('PATH')
    .split(':')
    .filter((e, idx, collection) => collection.indexOf(e) === idx)
    .reverse()
    .concat(dirs)
    .reverse()
    .join(':')

// ./pathfix append ruby
const append = ({dirs}) => getenv('PATH')
    .split(':')
    .filter((e, idx, collection) => collection.indexOf(e) === idx)
    .concat(dirs)
    .join(':')

try {
    main()
} catch(e) {
    console.log(e.message)
}
//.end
