#!/usr/bin/env node

'use strict';

var config = require('./config');

var fs = require('fs');
var spawn = require('child_process').spawn;

var encoding = { encoding: 'ascii' };

var data = fs
    .readFileSync(process.argv[2], encoding)
    .split('\n')
    .filter(function(s) { return s !== '' })
    .filter(function(s) { return s.match(/result:/) })
    .map(function(s) { return s
        .replace(/result:\s+/, '')
        .replace(/\s+/g, ', ')
        .replace(/^,\s+/, '')
        .replace(process.argv[3] + ', ', '')
        .replace(process.argv[4] + ', ', '')
    });

var fontHeight = 15;
var f3gnuplot = fs.readFileSync('f3.gnuplot', encoding).replace('WIDTH', data.length*fontHeight);

fs.writeFileSync('f3.gnuplot', f3gnuplot, encoding);

//var gnuplot = spawn(config.gnuplot, ['f3.gnuplot']);