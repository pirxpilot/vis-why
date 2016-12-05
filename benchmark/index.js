var simplify = require('..');

/* global suite, set, before, bench */

suite('vis-why', function () {
  set('type', 'adaptive');
  set('mintime', 2000);

  before(function() {
    this.shortPolyline = require('../test/fixtures/short.json');
    this.longPolyline = require('../test/fixtures/long.json');
  });

  bench('short', function() {
    simplify(this.shortPolyline, 5);
  });

  bench('long', function() {
    simplify(this.longPolyline, 10);
  });
});
