var simplify = require('..');

/* global describe, it */

describe('simplify', function() {
  it('should not change short polylines', function() {
    simplify([]).should.have.length(0);
    simplify([[0, 0], [1, 1]]).should.eql([[0, 0], [1, 1]]);
  });

  it('should work with small limits', function() {
    simplify([[0, 0], [1, 1], [2, 2]], 2).should.eql([[0, 0], [2, 2]]);
  });

  it('should not change anything if limit is larger than poly length', function() {
    simplify([[0, 0], [1, 1], [2, 2]], 4).should.eql([[0, 0], [1, 1], [2, 2]]);
  });


  it('should simplify longer polylines', function() {

    var poly = [
      [0, 0],
      [1, 0],
      [1, 1],
      [3, 1],
      [3, 3],
      [4, 4],
      [5, 4],
      [8, 5],
      [8, 7],
      [9, 9]
    ];

    simplify(poly, 4).should.eql([[ 0, 0 ], [ 3, 1 ], [ 8, 5 ], [ 9, 9 ]]);

  });
});