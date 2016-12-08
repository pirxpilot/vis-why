var heap = require('code42day-binary-heap');

module.exports = simplify;

function area(poly, prev, self, next) {
  var
    a = poly[self],
    b = poly[prev],
    c = poly[next];

  return Math.abs(
    (a[0] - c[0]) * (b[1] - a[1]) -
    (a[0] - b[0]) * (c[1] - a[1])
  );
}


function areaCompare(p, q) {
  return p.area - q.area;
}


function calculate(poly) {
  var i, triangle, ts = {
    heap: heap(areaCompare),
    poly: poly,
    list: new Array(poly.length - 2)
  };
  var prev = 0, ta;

  // calculate areas
  for (i = 1; i < poly.length - 1; i++) {
    ta = area(poly, prev, i, i + 1);
    if (!ta) {
      // skip empty
      continue;
    }
    triangle = {
      prev: prev,
      self: i,
      next: i + 1,
      area: ta
    };
    prev = i;
    if (!ts.first) {
      ts.first = triangle;
    }
    ts.list[triangle.self] = triangle;
  }

  ts.heap.rebuild(ts.list.filter(function(t) { return t; }));

  return ts;
}


function eliminate(ts, limit) {
  var triangle,
    prevTriangle,
    nextTriangle,
    counter = ts.heap.size() - limit;

  while(counter--) {
    triangle = ts.heap.pop();

    prevTriangle = ts.list[triangle.prev];
    nextTriangle = ts.list[triangle.next];

    // recalculate neighbors
    if (prevTriangle) {
      ts.heap.remove(prevTriangle);
      prevTriangle.next = triangle.next;
      prevTriangle.area = area(ts.poly, prevTriangle.prev, prevTriangle.self, prevTriangle.next);
      ts.heap.push(prevTriangle);
    } else {
      ts.first = nextTriangle;
    }
    if (nextTriangle) {
      ts.heap.remove(nextTriangle);
      nextTriangle.prev = triangle.prev;
      nextTriangle.area = area(ts.poly, nextTriangle.prev, nextTriangle.self, nextTriangle.next);
      ts.heap.push(nextTriangle);
    }
  }
}



function collect(ts) {
  var
    triangle = ts.first,
    nextTriangle,
    poly = [
      ts.poly[triangle.prev]
    ];

  while(true) {
    poly.push(ts.poly[triangle.self]);
    nextTriangle = ts.list[triangle.next];
    if (!nextTriangle) {
      break;
    }
    triangle = nextTriangle;
  }

  poly.push(ts.poly[triangle.next]);

  return poly;
}

function simplify(poly, limit) {
  if (poly.length < 3) {
    return poly;
  }

  if (limit < 3) {
    return [poly[0], poly[poly.length - 1]];
  }


  if (poly.length <= limit) {
    return poly;
  }

  var ts = calculate(poly);
  if (!ts.first) {
    // empty heap - straight line with all triangles empty
    return [poly[0], poly[poly.length - 1]];
  }
  eliminate(ts, limit - 2); // limit is in points, and we are counting triangles
  return collect(ts);
}
