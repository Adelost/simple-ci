exports.coverage = function (res) {
  const coverages = [];
  rowsBetween(res.out, /Uncovered Line #s/, 2, /---------/, 1).forEach(row => {
    const r = row.split('|').map(_ => _.trim());
    coverages.push({
      file: r[0],
      stmts: +r[1],
      branch: +r[2],
      funcs: +r[3],
      lines: +r[4]
    });
  });
  const coveredFiles = coverages.filter(_ => _.file.endsWith('.js')).sort((a, b) => a.lines - b.lines).map(_ => [_.file, _.lines]);
  const totalCoverage = coverages[0].lines;
  return {
    ok: totalCoverage >= 80,
    totalCoverage: totalCoverage,
    leastCoveredFiles: coveredFiles.filter(_ => _.lines !== 100).slice(0, 3)
  };
};

exports.testResult = function (res) {
  const rows = rowsBetween(res.out, /^\s{2}\d+ passing \(\w+\)/, 0, /----/, 1);
  const failingFiles = accumulateRowsBetween(rows, /^\s{2}\d+\)/, /:$/).map(_ => _.match(/\)(.*):/)[1].trim());
  let rawMs = rows[0].match(/\((.+)\)/)[1];
  rawMs = rawMs.replace('ms', '');
  rawMs = rawMs.replace('s', '000');
  const seconds = (+rawMs) / 1000;
  const failing = +rows[1].match(/\d+/) || 0;
  return {
    ok: failing === 0,
    passing: +rows[0].match(/\d+/),
    failing: failing,
    firstFailing: failingFiles.slice(0, 3),
    seconds: seconds
  };
};

exports.e2e = function (res) {
  const rows = rowsBetween(res.out, /\*\s+Failures/, 2, /Executed.*of.*specs.*/, 0).map(_ => _.replace(/\[.*]/, ''));
  const failingFiles = accumulateRowsBetween(rows, /^\s\d+/, /./).map(_ => _.replace(/\d+\)\s/, ''));
  const result = res.out.match(/Executed.*of.*specs.*/)[0];
  const total = +result.match(/of (\d+) specs/)[1];
  const failingMatch = result.match(/\((\d+) FAILED\)/);
  const failing = failingMatch ? +failingMatch[1] : 0;
  const seconds = +(result.match(/(\d+) sec/) || [])[1];
  const minutes = +(result.match(/(\d+) min/) || [])[1] || 0;
  return {
    ok: failing === 0,
    passing: total - failing,
    failing: failing,
    firstFailing: failingFiles.slice(0, 3),
    seconds: seconds + minutes * 60
  };
};

function accumulateRowsBetween(rows, reStart, reEnd) {
  let isMatching = false;
  let acc = [];
  const accs = [];
  rows.forEach((row) => {
    if (!isMatching) {
      if (row.match(reStart)) {
        isMatching = true;
      }
    }
    if (isMatching) {
      acc.push(row.trim());
      if (row.match(reEnd)) {
        isMatching = false;
        accs.push(acc.join(' '));
        acc = [];
      }
    }
  });
  return accs;
}

function rowsBetween(text, start, startShift, end, endShift) {
  let isMatching = false;
  const rows = [];
  text.split('\n').forEach((row, i, all) => {
    if (!isMatching) {
      const startRow = all[i - startShift];
      if (startRow !== undefined && startRow.match(start)) isMatching = true;
    }
    if (isMatching) {
      rows.push(row);
      const endRow = all[i + endShift];
      if (endRow !== undefined && endRow.match(end)) isMatching = false;
    }
  });
  return rows;
}
