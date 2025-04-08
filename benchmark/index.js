import fs from 'node:fs';
import polyline from 'polyline-encoded';
import simplify from '../index.js';

import LONG_POLY from '../test/fixtures/long.json' with { type: 'json' };
import SHORT_POLY from '../test/fixtures/short.json' with { type: 'json' };

/* global suite, set, before, bench */

function readPolyline(filename) {
  const path = [import.meta.dirname, '../test/fixtures', filename].join('/');
  const txt = fs.readFileSync(path, 'utf8');
  return polyline.decode(txt);
}

const usa = readPolyline('usa.txt');

suite('vis-why', function () {
  // run each bench for at least 2s
  set('type', 'adaptive');
  set('mintime', 2000);
  // or switch to fixed number of iterations
  // set('iterations', 500);

  bench('short', function () {
    simplify(SHORT_POLY, 5);
  });

  bench('long', function () {
    simplify(LONG_POLY, 10);
  });

  [1000, 5000, 10000, 30000].forEach(function (len) {
    const polyline = usa.slice(-len);
    bench(`huge ${len}`, function () {
      simplify(polyline, len / 100);
    });
  });
});
