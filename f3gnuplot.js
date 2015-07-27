#!/usr/bin/env node

'use strict';

var config = require('./config');

var fs = require('fs');
var spawn = require('child_process').spawn;

var folder = path.join(process.argv[2], '..');
var encoding = { encoding: 'ascii' };

var byZ = []; // для сортировки строк по значению Z

var data = fs
    .readFileSync(process.argv[2], encoding)
    .split('\n')
    .filter(function(s) { return s !== '' })
    .forEach(function(s) {
        var z = s.split(' ')[4];
        var p = [s.split(' ')[0], s.split(' ')[1]]; // Пара популяций
        var snp = s.split(' ')[5];
        var f3 = s.split(' ')[2];

        if ((z <= -3) && (snp > 10000)) byZ.push( { Z: z,  string: s, pair: p.sort(), f3: f3 } )
    });

byZ.sort(function (a, b) { return (a.f3 > b.f3) ? -1 : 1 });

var f3gnuplottxt = [];
byZ = byZ.filter(function(a, i) { return i % 2 } )
    .forEach(function(zobj, i) {
        var s = zobj.string.split(' ');
        var se = parseFloat(s[3]);
        var f3 = parseFloat(s[2]);
        f3gnuplottxt.push((i + 1) + '\t' + (f3 - se) + '\t' + (f3 - 3*se) + '\t' + (f3 + 3*se) + '\t' + (f3 + se) + '\t' + f3 + '\t' +  s[0] + '-' + s[1] + '(' + zobj.Z + ')' );
    });

f3gnuplottxt = f3gnuplottxt.map(function(s) { return s.replace(/_/g, '-') });

var fontHeight = 26;
var gnuplot = 'set terminal png size ' + fontHeight*f3gnuplottxt.length + ', 1000 \n'
    + 'set output "' + path.join(folder, 'f3.png') +'" \n'
    + 'set xrange [0:' + (f3gnuplottxt.length + 1) + '] \n'
    + 'set yrange [-0.02:0.01] \n'
    + 'set xtics rotate \n'
    + 'set tics rotate \n'
    + 'plot "'
    + path.join(folder, 'f3gnuplot.txt') + '" u 1:2:3:4:5 w candlesticks fs solid 0.7 lt 7 notitle, "'
    + path.join(folder, 'f3gnuplot.txt') + '" u 1:6:xticlabels(7) w points pt 7 lt 3 notitle\n';

fs.writeFileSync(path.join(folder, 'f3.gnuplot'), gnuplot, encoding);
fs.writeFileSync(path.join(folder, 'f3gnuplot.txt'), f3gnuplottxt.join('\n'), encoding);

spawn(config.gnuplot, [path.join(folder, 'f3.gnuplot')]);