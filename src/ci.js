const fs = require('fs');
const path = require('path');
const stringify = require('json-stringify-pretty-compact');
const bash = require('./bash');
const ci = this;

exports.workdir = path.join(__dirname, '/../tmp');
exports.threads = 4;
exports.reapos = [];
exports.channels = {};

exports.start = async function(repos, interval) {
  await bash(`mkdir -p ${exports.workdir}`);
  await initAll(repos);
  while (true) {
    await updateAll(repos);
    console.log(`end of loop, next update in ${interval} secs`);
    await ci.sleep(interval);
  }
};

exports.sleep = function(ms) {
  return new Promise(resolve => setTimeout(resolve, Math.ceil(ms * 1000)));
};

exports.bash = async function(repo, cmd) {
  return bash(`
  ${shToRepo(repo)}
  ${cmd}
  `);
};

exports.log = function(repo, msg) {
  console.log(`${msg} (${repo.name})`);
};

exports.createSync = function() {
  let outerResolve = null;
  const promise = new Promise(resolve => (outerResolve = resolve));
  return { promise, resolve: outerResolve };
};

async function initAll(repos) {
  await batch(repos.map(repo => async () => {
    repo.out = {};
    repo.status = {};
    repo.status.new = true;
    repo.status.installed = false;
    repo.status.shouldUpdate = true;
    if (!(await isCloned(repo))) {
      ci.log(repo, 'not cloned');
      ci.log(repo, 'cloning');
      await clone(repo);
      ci.log(repo, 'cloning DONE');
    } else {
      repo.status.installed = true;
      ci.log(repo, 'already cloned');
    }
  }), ci.threads);
  await batch(repos.map(repo => async () => {
    if (!repo.status.installed) {
      ci.log(repo, 'installing');
      await init(repo);
      repo.status.installed = true;
    } else {
      ci.log(repo, 'already installed');
    }
  }), ci.threads);
}

async function updateAll(repos) {
  let wasUpdated = false;
  await batch(repos.map(repo => async () => {
    if (repo.status.new) {
      repo.status.new = false;
      return;
    }
    ci.log(repo, 'checking for updates');
    if (!(await isLatest(repo))) {
      ci.log(repo, 'outdated');
      ci.log(repo, 'rebasing');
      await rebase(repo);
      repo.status.shouldUpdate = true;
      return;
    }
    ci.log(repo, 'up-to-date');
  }), ci.threads);
  await batch(repos.map(repo => async () => {
    if (repo.status.shouldUpdate) {
      if (repo.onUpdate) {
        ci.log(repo, 'updating');
        await repo.onUpdate(fnParams(repo));
        ci.log(repo, 'updating DONE');
      }
    }
  }), ci.threads);
  await batch(repos.map(repo => async () => {
    if (repo.status.shouldUpdate) {
      if (repo.onAtomicUpdate) {
        ci.log(repo, 'atomic updating');
        await repo.onAtomicUpdate(fnParams(repo));
        ci.log(repo, 'atomic updating DONE');
      }
    }
  }), 1);
  repos.forEach(repo => {
    if (repo.status.shouldUpdate) {
      repo.status.shouldUpdate = false;
      wasUpdated = true;
    }
  });
  if (wasUpdated) {
    console.log('saving result');
    saveResult(repos);
  } else {
    console.log('all up-to-date');
  }
}

async function batch(workers, batchSize) {
  while (workers.length > 0) {
    const batch = workers.splice(0, batchSize);
    await Promise.all(batch.map(_ => _()));
  }
}

async function isCloned(repo) {
  return (await bash(`cd '${ci.workdir}'; test -d ${repo.dir}`)).ok;
}

async function init(repo) {
  if (repo.onInit) {
    await repo.onInit(fnParams(repo));
  }
}

async function clone(repo) {
  await bash(`cd '${ci.workdir}'; git clone ${repo.url}`);
}

async function isLatest(repo) {
  return ci.bash(repo, `
  git remote update
  git status
  `).then(resultToIsLatest);
}

async function rebase(repo) {
  await ci.bash(repo, `git pull --rebase`);
}

function shToRepo(repo) {
  return `cd '${ci.workdir}/${repo.dir}'`;
}

function resultToIsLatest(res) {
  return !res.out.match(/Your branch is behind.*can be fast-forwarded/);
}

function saveResult(repos) {
  const out = {};
  repos.forEach(_ => {
    if (_.out) out[_.name] = _.out;
  });
  fs.writeFileSync(`${ci.workdir}/result.json`, stringify(out), 'utf8');
}

function fnParams(repo) {
  return {
    repo: repo,
    out: repo.out,
    run: cmd => ci.bash(repo, cmd),
    log: msg => ci.log(repo, msg),
    sleep: ci.sleep,
    receive: (name) => {
      ci.log(repo, `receive '${name}'`);
      return receive(name);
    },
    send: (name, value) => {
      ci.log(repo, `send '${name}'`);
      send(name, value);
    }
  };
}

function receive(name) {
  let channel = ci.channels[name];
  if (!channel) {
    channel = { values: [], listeners: [] };
    ci.channels[name] = channel;
  }
  return new Promise(resolve => {
    if (channel.values.length > 0) {
      const value = channel.listeners.shift();
      resolve(value);
    } else {
      channel.listeners.push(resolve);
    }
  });
}

function send(name, value) {
  let channel = ci.channels[name];
  if (!channel) {
    channel = { values: [], listeners: [] };
    ci.channels[name] = channel;
  }
  if (channel.listeners.length > 0) {
    const listener = channel.listeners.shift();
    listener(value);
  } else {
    channel.values.push(value);
  }
}
