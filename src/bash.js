// const exec = require('child_process').exec;
const { spawn, exec } = require('child_process');

// module.exports = function (cmd) {
//   return new Promise(resolve => {
//     const handle = spawn('dir');
//     // const handle = spawn(`npm run bash -- ${cmd}`);
//     handle.stdout.on('data', console.log);
//     handle.stderr.on('data', console.error);
//     handle.on('close', code => {
//       console.log('Exit code', code);
//       resolve(code);
//     });
//   });
// };

module.exports = function (cmd) {
  return new Promise(resolve => {
    // const handle = exec(`npm run bash -- ${cmd}`);
    console.log('======');
    const handle = exec(`npm run bash -- ${cmd}`, (error, stdout, stderr) => {
      // console.log(stdout);
      // console.error(stderr);
      // if (error !== null) {
      //   console.error(`exec error: ${error.code}`);
      // }
      // resolve(stdout);
      // console.log('======');
    });
    handle.stdout.on('data', _ => process.stdout.write(_));
    handle.stderr.on('data', _ => process.stderr.write(_));
    handle.on('close', _ => {
      console.log('#CLOSE', _);
      resolve(_);
    });
  });
};
