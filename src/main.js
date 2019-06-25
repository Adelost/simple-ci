const ci = require('./ci');
const resultTo = require('./result-to');

const repo = {
  api: {
    name: 'api',
    dir: 'fabasapi',
    url: 'git@bitbucket.org:fabasweb/fabasapi.git',
    onInit: async ({ run }) => {
      await run('npm install');
      await run('npm run update-env');
    },
    onUpdate: async ({ log, run }) => {
      log('updating npm');
      await run('npm install');
      await run('npm run update-env');
    },
    onAtomicUpdate: async ({ log, run, out }) => {
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
    onInit: async ({ run }) => {
      await run('npm install');
      await run('npm run e2e-install -- --versions.chrome 74.0.3729.6');
    },
    onUpdate: async ({ log, run }) => {
      log('updating npm');
      await run('npm install');
    },
    onAtomicUpdate: async ({ log, run, out }) => {
      log('running e2e');
      out.e2e = await run('npm run e2e').then(resultTo.e2e);
    }
  }
};

ci.start(Object.values(repo), 20);
