const bash = require('./bash');

exports.threads = 4;
exports.reapos = [];

exports.start = async function(fn) {
  while (true) {
    await fn();
    console.log('End of loop');
  }
};

exports.sleep = function(ms) {
  return new Promise(resolve => setTimeout(resolve, Math.ceil(ms * 1000)));
};

exports.prepareRepos = async function(repos) {
  await batch(repos.map(repo => async () => {
    if (!(await isRepoCloned(repo))) {
      await cloneRepo(repo);
    }
    // if (await isRepoLatest(repo)) {
    //   await rebaseRepo(repo);
    // }
  }), this.threads);
};

async function batch(workers, batchSize) {
  while (workers.length > 0) {
    const batch = workers.splice(0, batchSize);
    await Promise.all(batch.map(_ => _()));
  }
}

async function isRepoCloned(repo) {
  return (await bash(`test -d ${repo.name}`)).ok;
}

async function cloneRepo(repo) {
  await bash(`git clone ${repo.url}`);
  console.log(`Cloning '${repo.name}' DONE`);
}

async function isRepoLatest(repo) {
  await bash(`
    echo one
    sleep 2
    echo two
    sleep 2
    echo tree
    sleep 2
    cd tmp
    ls
    #echo "${repo.url}"
    sleep 2
  `);
}

async function rebaseRepo(repo) {
  await bash(`
    echo one
    sleep 2
    echo two
    sleep 2
    echo tree
    sleep 2
    cd tmp
    ls
    #echo "${repo.url}"
    sleep 2
  `);
}
