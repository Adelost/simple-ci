// const exec = require('child_process').exec;
const { exec } = require('child_process');
const stripAnsi = require('strip-ansi');

module.exports = function (cmd, verbose) {
  return new Promise(resolve => {
    const cmd64 = Buffer.from(cmd, 'utf8').toString('base64');
    let log = false;
    const handle = exec(`npm run bash -- ${cmd64}`, (_, stdout, stderr) => {
      stdout = stripAnsi(stdout);
      stderr = stripAnsi(stderr);
      const match = stdout.match(/__NPM_BASH_START__\n((.|\n|\r)*)__NPM_BASH_EXIT_CODE__(\d+)/);
      stdout = match[1];
      const exitCode = +match[3];
      const out = {
        ok: exitCode === 0,
        code: exitCode,
        out: stdout || null,
        err: stderr || null
      };
      resolve(out);
    });
    verbose = false;
    if (verbose) {
      handle.stdout.on('data', _ => {
        const stopMatch = _.match(/__NPM_BASH_EXIT_CODE__(\d+)/);
        if (log && stopMatch) log = false;
        if (log) process.stdout.write(_);
        if (!log && _.match(/__NPM_BASH_START__/)) log = true;
      });
      handle.stderr.on('data', _ => {
        if (log) process.stderr.write(_);
      });
    }
  });
};
