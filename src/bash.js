// const exec = require('child_process').exec;
const { exec } = require('child_process');
const stripAnsi = require('strip-ansi');

module.exports = function (cmd) {
  return new Promise(resolve => {
    cmd = Buffer.from(cmd, 'utf8').toString('base64');
    let stdout = '';
    let stderr = '';
    let log = false;
    let exitCode = 0;
    // const handle = exec(`npm run bash`);
    const handle = exec(`npm run bash -- ${cmd}`);
    // const handle = exec(`${cmd}`);
    handle.stdout.on('data', _ => {
      const stopMatch = _.match(/__NPM_BASH_EXIT_CODE__(\d+)/);
      if (log && stopMatch) {
        exitCode = +stopMatch[1];
        log = false;
      }
      if (log) {
        process.stdout.write(_);
        stdout += _;
      }
      if (!log && _.match(/__NPM_BASH_START__/)) log = true;

    });
    handle.stderr.on('data', _ => {
      if (log) {
        process.stderr.write(_);
        stderr += _;
      }
    });
    handle.on('close', () => {
      // if (exitCode !== 0) console.error(`exit status ${exitCode}`);
      const out = {
        ok: exitCode === 0,
        code: exitCode,
        out: stripAnsi(stdout) || null,
        err: stripAnsi(stderr) || null
      };
      resolve(out);
    });
  });
};
