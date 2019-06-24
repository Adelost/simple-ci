// const ci = require('./ci');
// const resultTo = require('./result-to');
//
// const repo = {
//   api: {
//     name: 'api',
//     dir: 'fabasapi',
//     url: 'git@bitbucket.org:fabasweb/fabasapi.git',
//     onInit: async ({ log, run }) => {
//       await run('npm install');
//       await run('npm run update-env');
//     },
//     onUpdate: async ({ log, run, out }) => {
//       // await run('npm start');
//       log('updating npm');
//       await run('npm install');
//       await run('npm run update-env');
//       log('running coverage');
//       const coverageResult = await run('npm run coverage');
//       out.test = resultTo.testResult(coverageResult);
//       out.coverage = resultTo.coverage(coverageResult);
//     }
//   },
//   web: {
//     name: 'web',
//     dir: 'fabasweb',
//     url: 'git@bitbucket.org:fabasweb/fabasweb.git',
//     onInit: async ({ log, run }) => {
//       await run('npm install');
//       await run('npm run e2e-install');
//     },
//     onUpdate: async ({ log, run, out }) => {
//       log('updating npm');
//       await run('npm install');
//       // log('running e2e');
//       // out.e2e = await run('npm run e2e').then(resultTo.e2e);
//     }
//   }
// };
//
// ci.start(Object.values(repo));
