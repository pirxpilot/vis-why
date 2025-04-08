const { describe, it } = require('node:test');
const simplify = require('..');

describe('simplify', () => {
  it('should not change short polylines', t => {
    t.assert.deepEqual(simplify([]), []);
    t.assert.deepEqual(
      simplify([
        [0, 0],
        [1, 1]
      ]),
      [
        [0, 0],
        [1, 1]
      ]
    );
  });

  it('should work with small limits', t => {
    t.assert.deepEqual(
      simplify(
        [
          [0, 0],
          [1, 1.5],
          [2, 2]
        ],
        2
      ),
      [
        [0, 0],
        [2, 2]
      ]
    );
  });

  it('should not change anything if limit is larger than poly length', t => {
    t.assert.deepEqual(
      simplify(
        [
          [0, 0],
          [1, 1],
          [2, 2]
        ],
        4
      ),
      [
        [0, 0],
        [1, 1],
        [2, 2]
      ]
    );
  });

  it('should simplify longer polylines', t => {
    const poly = [
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

    t.assert.deepEqual(simplify(poly, 4), [
      [0, 0],
      [3, 3],
      [8, 5],
      [9, 9]
    ]);
  });

  it('should simplify longer polylines using custom properties', t => {
    function area(a, b, c) {
      return Math.abs((a.x - c.x) * (b.y - a.y) - (a.x - b.x) * (c.y - a.y));
    }

    const poly = [
      { x: 0, y: 0, label: 'a' },
      { x: 1, y: 0, label: 'b' },
      { x: 1, y: 1, label: 'c' },
      { x: 3, y: 1, label: 'd' },
      { x: 3, y: 3, label: 'e' },
      { x: 4, y: 4, label: 'f' },
      { x: 5, y: 4, label: 'g' },
      { x: 8, y: 5, label: 'h' },
      { x: 8, y: 7, label: 'i' },
      { x: 9, y: 9, label: 'j' }
    ];

    t.assert.deepEqual(simplify(poly, 4, area), [
      { x: 0, y: 0, label: 'a' },
      { x: 3, y: 3, label: 'e' },
      { x: 8, y: 5, label: 'h' },
      { x: 9, y: 9, label: 'j' }
    ]);
  });

  it('should keep the ends of the straight line', t => {
    const poly = [
      [-3, -3],
      [0, 0],
      [1, 1],
      [2, 2],
      [5, 5]
    ];

    t.assert.deepEqual(simplify(poly, 2), [
      [-3, -3],
      [5, 5]
    ]);
    t.assert.deepEqual(simplify(poly, 3), [
      [-3, -3],
      [5, 5]
    ]);
  });

  it('should remove duplicate stops', t => {
    const poly = [
      [-91.9655, 39.55001],
      [-91.9655, 39.55001],
      [-91.96581, 39.55024],
      [-91.96596, 39.55041],
      [-91.96599, 39.55053],
      [-91.96588, 39.5532],
      [-91.96581, 39.55578],
      [-91.96573, 39.55764],
      [-91.96573, 39.55764],
      [-91.96509, 39.55763]
    ];

    t.assert.deepEqual(simplify(poly, 9), [
      [-91.9655, 39.55001],
      [-91.96581, 39.55024],
      [-91.96596, 39.55041],
      [-91.96599, 39.55053],
      [-91.96588, 39.5532],
      [-91.96581, 39.55578],
      [-91.96573, 39.55764],
      [-91.96509, 39.55763]
    ]);
  });

  it('should simplify longer polyline', t => {
    const poly = require('./fixtures/long.json');
    const simplified = require('./fixtures/simplified-long.json');

    t.assert.deepEqual(simplify(poly, 40), simplified);
  });

  it('should keep the first point', t => {
    const poly = [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 1],
      [4, 2],
      [4, 4]
    ];
    t.assert.deepEqual(simplify(poly, 4), [
      [0, 0],
      [2, 0],
      [4, 2],
      [4, 4]
    ]);
  });
});
