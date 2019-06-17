const bash = require('./bash');

main();

async function main() {
  while (true) {
    // await bash(`cd tmp; cd KeyHook; git status`);
    await bash(`lss`);

    // console.log('Zzz');
    await sleep(100);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, Math.ceil(ms * 1000)));
}


