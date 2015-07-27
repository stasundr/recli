#!/usr/bin/env node

'use strict';

var prefix = new RegExp('^f3_');
var folder = process.argv[2];
var encoding = { encoding: 'ascii' };
var headerRows = 12;
var footerRows = 2;

var fs = require('fs');
var path = require('path');

var nd = new RegExp('no data');

var list = fs
    .readdirSync(folder)
    .filter(function(s) { return s.match(prefix) })
    .map(function(s) { return path.join(folder, s, '/f3.out') })
    .forEach(function(file) {
        var results = fs
            .readFileSync(file, encoding)
            .split('\n');

        results.splice(0, headerRows);
        results.splice(results.length - footerRows, footerRows);

        results = results
            .filter(function(s) { return !s.match(nd) })
            .map(function(s) { var r = s
                .replace('result:', '')
                .replace(/\s+/g, ' ')
                .split(' ');

                r.splice(0, 1);
                r.splice(2, 1);

                return r.join(' ');
            })
            .filter(function(s) { return s.split(' ')[2] < 0 });


        console.log(results.join('\n'));
    });