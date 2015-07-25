#!/usr/bin/env node

// Использование: f3allpairs.js target
// Для каждой популяции из *ind файла (указанного в config.js) запускает f3.js any_population_A any_population_B target

var Set = require('collections/set');
var spawn = require('child_process').spawn;

var populations = new Set (
    require('fs')
        .readFileSync(config.ind, { encoding: 'ascii' })
        .split('\n')
        .filter(function(s){ return s !== '' })
        .map(function(s) { return (s.match(/[A-Za-z.-_]+$/) + '') })
).toArray()
    .filter(function(s) {
        return !(s.match(/FAIL$/)) && !(s.match(/^Ignore/))
    });

populations.forEach(function(population) {
    spawn('f3.js', [population, 'X', process.argv[2]])
});