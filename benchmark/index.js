var fs = require('fs');
var polyline = require('polyline-encoded');
var simplify = require('..');

/* global suite, set, before, bench */

function readPolyline(filename) {
  var path = [__dirname, '../test/fixtures', filename].join('/');
  var txt = fs.readFileSync(path, 'utf8');
  return polyline.decode(txt);
}

var usa = readPolyline('usa.txt');

suite('vis-why', function () {
  // run each bench for at least 2s
  set('type', 'adaptive');
  set('mintime', 2000);
  // or switch to fixed number of iterations
  // set('iterations', 500);

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

  [1000, 5000, 10000, 30000].forEach(function(len) {
    var polyline = usa.slice(-len);
    bench('huge ' + len, function() {
      simplify(polyline, len / 100);
    });
  });
});
