const ci = require('./ci');
const resultTo = require('./result-to');

const repo = {
  api: {
    name: 'api',
    dir: 'fabasapi',
    url: 'git@bitbucket.org:fabasweb/fabasapi.git',
    out: {},
    onInit: async ({ log, run, send, receive }) => {
      log('installing');
      await receive('web-cloned');
      await run('npm run update');
      await send('full-installed');
    },
    onUpdate: async ({ log, run, out }) => {
      log('running coverage');
      const coverageResult = await run('npm run coverage');
      out.test = resultTo.testResult(coverageResult);
      out.coverage = resultTo.coverage(coverageResult);
    }
  },
  web: {
    name: 'web',
    dir: 'fabasweb',
    url: 'git@bitbucket.org:fabasweb/fabasweb.git',
    out: {},
    onInit: async ({ log, run, send, receive }) => {
      send('web-cloned');
      log('installing');
      await run('npm install');
      await receive('full-installed');
      await run('npm run e2e-install');
    },
    onUpdate: async ({ log, run, out }) => {
      // log('running e2e');
      // out.e2e = await run('npm run e2e').then(resultTo.e2e);
    }
  }
};

ci.start(Object.values(repo));
