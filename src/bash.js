// const exec = require('child_process').exec;
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const stripAnsi = require('strip-ansi');

const TMP_FILE = path.join(__dirname, '../tmp/tmp.sh');

module.exports = function (cmd) {
  return new Promise(resolve => {
    let bufStr = Buffer.from(cmd, 'utf8').toString('base64');
    console.log(bufStr);
    fs.writeFileSync(TMP_FILE, cmd);
    // echo QWxhZGRpbjpvcGVuIHNlc2FtZQ== | base64 --decode
    let stdout = '';
    let stderr = '';
    let count = 0;
    // let npmExit = false;
    const handle = exec(`npm run bash`);
    handle.stdout.on('data', _ => {
      if (count++ === 0) return;
      process.stdout.write(_);
      stdout += _;
    });
    handle.stderr.on('data', _ => {
      // if (_.match(/npm/g)) {
      //   npmExit = true;
      // }
      // if (npmExit) return;
      process.stderr.write(_);
      stderr += _;
    });
    handle.on('close', code => {

      const out = {
        ok: code === 0,
        out: stripAnsi(stdout) || null,
        err: stripAnsi(stderr) || null
      };
      fs.unlinkSync(TMP_FILE);
      resolve(out);
    });
  });
};

//
// { npm ERR! file sh
//   npm }
// npm ERR! file sh
// npm{  ERR! code ELIFECYCLE
//   npm ERR! errno ENOEN
