#!/usr/bin/env node

var config = require('./config');

// dependencies
var mkdirp = require('mkdirp');
var Set = require("collections/set");
var fs = require('fs');
var spawn = require('child_process').spawn;
var crypto = require('crypto');
var path = require('path');

// prepare folder
var token = 'f3_' + crypto.createHash('md5').update(Date.now() + Math.random() + '').digest('hex');
var folder = config.history + token;
var encoding = { encoding: 'ascii' };

// prepare content for files
var f3sh = '#!/usr/bin/env bash\n\nbsub -q short -W 720 -u ' + config.mail + ' < ' + path.join(folder, 'f3.bsub');

var f3bsub = config.f3 + ' -p ' + path.join(folder, 'f3.par') + ' > ' + path.join(folder, 'f3.out');

var f3par = 'genotypename: ' + config.geno
    + '\nindivname:    ' + config.ind
    + '\nsnpname:      ' + config.snp
    + '\npopfilename:  ' + path.join(folder, 'f3.pfn');

var pref3pfn = new Set (
    require('fs')
        .readFileSync(config.ind, { encoding: 'ascii' })
        .split('\n')
        .filter(function(s){ return s !== '' })
        .map(function(s) { return (s.match(/[A-Za-z.-_]+$/) + '') })
).toArray()
    .filter(function(s) {
        return !(s.match(/FAIL$/)) && !(s.match(/^Ignore/))
    });

var f3pfn = [];
pref3pfn.forEach(function(s) {
    if (process.argv[2] == 'X') f3pfn.push(s + ' ' + process.argv[3] + ' ' + process.argv[4]);
    if (process.argv[3] == 'X') f3pfn.push(process.argv[2] + ' ' + s + ' ' + process.argv[4]);
    if (process.argv[4] == 'X') f3pfn.push(process.argv[2] + ' ' + process.argv[3] + ' ' + s);
});
f3pfn = f3pfn.join('\n');

// mkdir, save files, run
mkdirp(folder, function(error) {
    if (error) throw error;

    fs.writeFileSync(path.join(folder, 'f3.sh'), f3sh, encoding);
    fs.writeFileSync(path.join(folder, 'f3.par'), f3par, encoding);
    fs.writeFileSync(path.join(folder, 'f3.pfn'), f3pfn, encoding);
    fs.writeFileSync(path.join(folder, 'f3.bsub'), f3bsub, encoding);

    var sh = spawn('bash', [path.join(folder, 'f3.sh')]);

    console.log(folder);

    // curl'ом отправлять на сервер с elasticsearch
    //'\n\ncurl -F "evec=@./smartpca.evec" -F "task=' +  token + '" ' + geneticAtlas + '/addfile';
    //
});