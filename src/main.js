const bash = require('./bash');
const utils = require('./utils');

// main();

async function main() {
  while (true) {
    await checkCoverage();
    await bash(`git status`);
    console.log((await bash(`git status`)).ok);

    console.log('Zzz');
    await utils.sleep(100);
  }
}

async function checkCoverage() {
  const { out } = await bash(`
  cd tmp
  cd fabasapi
  npm run coverage
  `);
  console.log(out);
}

const out = `

-------------------------|----------|----------|----------|----------|-------------------|
File                     |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
-------------------------|----------|----------|----------|----------|-------------------|
[31;1mAll files               [0m |[31;1m     31.3[0m |[31;1m      5.5[0m |[31;1m    26.34[0m |[31;1m    33.53[0m |[31;1m                  [0m |
[33;1m controllers            [0m |[33;1m    66.94[0m |[33;1m       50[0m |[33;1m    60.47[0m |[33;1m    66.94[0m |[31;1m                  [0m |
[31;1m  articles.js           [0m |[31;1m       18[0m |[31;1m        0[0m |[31;1m        0[0m |[31;1m       18[0m |[31;1m... 68,69,70,74,75[0m |
[32;1m  articles.spec.js      [0m |[32;1m      100[0m |[32;1m      100[0m |[32;1m      100[0m |[32;1m      100[0m |[33;1m                  [0m |
[32;1m  auth.js               [0m |[32;1m      100[0m |[32;1m      100[0m |[32;1m      100[0m |[32;1m      100[0m |[33;1m                  [0m |
[32;1m  auth.spec.js          [0m |[32;1m      100[0m |[32;1m      100[0m |[32;1m      100[0m |[32;1m      100[0m |[33;1m                  [0m |
[31;1m utils                  [0m |[31;1m    39.22[0m |[31;1m     9.52[0m |[31;1m    34.68[0m |[31;1m    41.08[0m |[31;1m                  [0m |
[31;1m  api.js                [0m |[31;1m    41.67[0m |[31;1m        0[0m |[31;1m       25[0m |[31;1m    45.45[0m |[31;1m  9,10,14,15,16,18[0m |
[32;1m  auth.js               [0m |[32;1m      100[0m |[32;1m      100[0m |[32;1m      100[0m |[32;1m      100[0m |[33;1m                  [0m |
[32;1m  env.js                [0m |[32;1m      100[0m |[32;1m      100[0m |[32;1m      100[0m |[32;1m      100[0m |[33;1m                  [0m |
[31;1m  old-opencontent.js    [0m |[31;1m     8.99[0m |[31;1m        0[0m |[31;1m        0[0m |[31;1m      9.3[0m |[31;1m... 26,327,328,337[0m |
[31;1m  opencontent-api.js    [0m |[31;1m    19.18[0m |[31;1m        0[0m |[31;1m     7.69[0m |[31;1m    22.95[0m |[31;1m... 13,114,116,120[0m |
[33;1m  opencontent-mappers.js[0m |[33;1m    71.43[0m |[31;1m        0[0m |[31;1m    33.33[0m |[33;1m    71.43[0m |[31;1m       15,20,28,46[0m |
[31;1m  opencontent.js        [0m |[31;1m       25[0m |[31;1m        0[0m |[31;1m        0[0m |[31;1m    30.43[0m |[31;1m... 43,47,51,52,55[0m |
[32;1m  order.js              [0m |[32;1m      100[0m |[32;1m      100[0m |[32;1m      100[0m |[32;1m      100[0m |[33;1m                  [0m |
[31;1m  query-string.js       [0m |[31;1m    38.46[0m |[31;1m        0[0m |[31;1m        0[0m |[31;1m    41.67[0m |[31;1m... 14,15,16,17,19[0m |
[33;1m  raw-api.js            [0m |[33;1m    77.08[0m |[33;1m    57.14[0m |[33;1m    72.73[0m |[33;1m    77.08[0m |[31;1m... 21,123,124,126[0m |
[32;1m  raw-api.spec.js       [0m |[32;1m      100[0m |[32;1m      100[0m |[32;1m      100[0m |[32;1m      100[0m |[33;1m                  [0m |
[32;1m  server-cache.js       [0m |[32;1m      100[0m |[32;1m      100[0m |[32;1m      100[0m |[32;1m      100[0m |[33;1m                  [0m |
[32;1m  test.js               [0m |[32;1m    94.12[0m |[32;1m      100[0m |[32;1m    90.48[0m |[32;1m    95.92[0m |[31;1m             41,49[0m |
[31;1m  utils.js              [0m |[31;1m    22.22[0m |[31;1m        0[0m |[31;1m        0[0m |[31;1m    22.22[0m |[31;1m... 18,19,20,21,25[0m |
[31;1m  validate.js           [0m |[31;1m    32.26[0m |[31;1m        0[0m |[31;1m       25[0m |[31;1m    32.26[0m |[31;1m... 44,45,46,48,49[0m |
[31;1m utils/InfoMakerNewsItem[0m |[31;1m     3.01[0m |[31;1m        0[0m |[31;1m        0[0m |[31;1m     3.47[0m |[31;1m                  [0m |
[31;1m  newsitemBody.js       [0m |[31;1m     0.74[0m |[31;1m        0[0m |[31;1m        0[0m |[31;1m     0.78[0m |[31;1m... 09,317,318,319[0m |
[31;1m  newsitemHeader.js     [0m |[31;1m     6.67[0m |[31;1m        0[0m |[31;1m        0[0m |[31;1m     9.09[0m |[31;1m... 11,12,13,14,19[0m |
[31;1m  newsitemJSON.js       [0m |[31;1m    14.29[0m |[31;1m        0[0m |[31;1m        0[0m |[31;1m    15.63[0m |[31;1m... 71,73,78,79,80[0m |
[31;1m  newsitemMeta.js       [0m |[31;1m     1.59[0m |[31;1m        0[0m |[31;1m        0[0m |[31;1m     2.22[0m |[31;1m... 11,113,114,116[0m |
[31;1m  newsitemOpengraph.js  [0m |[31;1m     1.96[0m |[31;1m        0[0m |[31;1m        0[0m |[31;1m     2.33[0m |[31;1m... 86,89,90,91,92[0m |
-------------------------|----------|----------|----------|----------|-------------------|

`;

out.split('\n').forEach(line => {
  const match = line.match(/(^.*All files.*$)/g);
  if (match) {
    const rawLine = match[0];
    const coverages = rawLine.match(/[\d.]*/g).filter(_ => _.match(/\d/)).map(_ => _.match(/[\d.]*/)[0]);
    console.log(coverages);
    console.log(out);
  }
});


// await bash(`
//     cd tmp
//     # git clone git@bitbucket.org:fabasweb/fabasapi.git
//     # git clone git@bitbucket.org:fabasweb/fabasweb.git
//     cd fabasapi
//     #npm install
//     #git pull --rebase
//     #npm run update
//     npm run coverage
//     ls
//     `);
