// const exec = require('child_process').exec;
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const TMP_FILE = path.join(__dirname, '../tmp/tmp.sh');

module.exports = function (cmd) {
  return new Promise(resolve => {
    fs.writeFileSync(TMP_FILE, cmd);

    let stdout = '';
    let stderr = '';
    let count = 0;
    // let npmExit = false;
    const handle = exec(`npm run bash`, (error, stdout, stderr) => {
      // console.log(stdout);
      // console.error(stderr);
      // if (error !== null) {
      //   console.error(`exec error: ${error.code}`);
      // }
    });
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
        out: stdout || null,
        err: stderr || null
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
