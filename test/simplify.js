var { describe, it } = require('node:test');
var simplify = require('..');

describe('simplify', function() {
  it('should not change short polylines', function() {
    simplify([]).should.have.length(0);
    simplify([[0, 0], [1, 1]]).should.eql([[0, 0], [1, 1]]);
  });

  it('should work with small limits', function() {
    simplify([[0, 0], [1, 1.5], [2, 2]], 2).should.eql([[0, 0], [2, 2]]);
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

    simplify(poly, 4).should.eql([[ 0, 0 ], [ 3, 3 ], [ 8, 5 ], [ 9, 9 ]]);

  });


  it('should simplify longer polylines using custom properties', function() {

    function area(a, b, c) {
      return Math.abs(
        (a.x - c.x) * (b.y - a.y) -
        (a.x - b.x) * (c.y - a.y)
      );
    }

    var poly = [
      {x: 0, y: 0, label: 'a'},
      {x: 1, y: 0, label: 'b'},
      {x: 1, y: 1, label: 'c'},
      {x: 3, y: 1, label: 'd'},
      {x: 3, y: 3, label: 'e'},
      {x: 4, y: 4, label: 'f'},
      {x: 5, y: 4, label: 'g'},
      {x: 8, y: 5, label: 'h'},
      {x: 8, y: 7, label: 'i'},
      {x: 9, y: 9, label: 'j'}
    ];

    simplify(poly, 4, area).should.eql([
      {x: 0, y: 0, label: 'a'},
      {x: 3, y: 3, label: 'e'},
      {x: 8, y: 5, label: 'h'},
      {x: 9, y: 9, label: 'j'}
    ]);

  });


  it('should keep the ends of the straight line', function() {

    var poly = [
      [-3, -3],
      [0, 0],
      [1, 1],
      [2, 2],
      [5, 5]
    ];

    simplify(poly, 2).should.eql([[ -3, -3 ], [ 5, 5 ]]);
    simplify(poly, 3).should.eql([[ -3, -3 ], [ 5, 5 ]]);
  });

  it('should remove duplicate stops', function () {
    var poly = [
      [-91.9655,  39.55001],
      [-91.9655,  39.55001],
      [-91.96581, 39.55024],
      [-91.96596, 39.55041],
      [-91.96599, 39.55053],
      [-91.96588, 39.55320],
      [-91.96581, 39.55578],
      [-91.96573, 39.55764],
      [-91.96573, 39.55764],
      [-91.96509, 39.55763]
    ];

    simplify(poly, 9).should.eql([
      [-91.9655,  39.55001],
      [-91.96581, 39.55024],
      [-91.96596, 39.55041],
      [-91.96599, 39.55053],
      [-91.96588, 39.55320],
      [-91.96581, 39.55578],
      [-91.96573, 39.55764],
      [-91.96509, 39.55763]
    ]);
  });


  it('should simplify longer polyline', function() {
    var poly = require('./fixtures/long.json');
    var simplified = require('./fixtures/simplified-long.json');

    simplify(poly, 40).should.eql(simplified);
  });

  it('should keep the first point', function () {
     var poly = [[0, 0], [1, 0], [2, 0], [3, 1], [4, 2], [4, 4]];
     simplify(poly, 4).should.eql([[0, 0], [2, 0], [4, 2], [4, 4]]);
  });
});
