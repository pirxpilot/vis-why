var heap = require('code42day-binary-heap');

module.exports = simplify;

function area(a, b, c, opts) {
  return Math.abs(
    (a[opts.xAxis] - c[opts.xAxis]) * (b[opts.yAxis] - a[opts.yAxis]) -
    (a[opts.xAxis] - b[opts.xAxis]) * (c[opts.yAxis] - a[opts.yAxis])
  );
}


function areaCompare(p, q) {
  return p.area - q.area;
}


function calculate(poly, opts) {
  var i,
    ts = { heap: heap(areaCompare, true) },
    triangle,
    trianglePrev,
    a = poly[0], b, c = poly[1],
    list = [];

  // calculate areas
  for (i = 2; i < poly.length; i++) {
    b = c;
    c = poly[i];
    triangle = {
      a: a,
      b: b,
      c: c,
      area: area(a, b, c, opts),
      next: null,
      prev: trianglePrev,
      _heapIndex: 0
    };
    if (!triangle.area) {
      continue;
    }
    a = b;
    if (trianglePrev) {
      trianglePrev.next = triangle;
    }
    list.push(triangle);
    trianglePrev = triangle;
  }

  ts.first = list[0];

  // create a heap
  ts.heap.rebuild(list);

  return ts;
}


function eliminate(ts, limit, opts) {
  var triangle,
    prevTriangle,
    nextTriangle,
    counter = ts.heap.size() - limit;

  while(counter-- > 0) {
    triangle = ts.heap.pop();
    prevTriangle = triangle.prev;
    nextTriangle = triangle.next;

    // recalculate neighbors
    if (prevTriangle) {
      ts.heap.remove(prevTriangle);
      prevTriangle.next = triangle.next;
      prevTriangle.c = triangle.c;
      prevTriangle.area = area(prevTriangle.a, prevTriangle.b, prevTriangle.c, opts);
      ts.heap.push(prevTriangle);
    } else {
      ts.first = triangle.next;
    }
    if (nextTriangle) {
      ts.heap.remove(nextTriangle);
      nextTriangle.prev = triangle.prev;
      nextTriangle.a = triangle.a;
      nextTriangle.area = area(nextTriangle.a, nextTriangle.b, nextTriangle.c, opts);
      ts.heap.push(nextTriangle);
    }
  }
}


function collect(triangle) {
  var poly = [triangle.a];

  while(true) {
    poly.push(triangle.b);
    if (!triangle.next) {
      break;
    }
    triangle = triangle.next;
  }

  poly.push(triangle.c);

  return poly;
}


function simplify(poly, limit, opts) {
  opts = opts || {};
  opts.xAxis = typeof opts.xAxis == 'undefined' ? 0 : opts.xAxis;
  opts.yAxis = typeof opts.yAxis == 'undefined' ? 1 : opts.yAxis;

  if (poly.length < 3) {
    return poly;
  }

  if (limit < 3) {
    return [poly[0], poly[poly.length - 1]];
  }


  if (poly.length <= limit) {
    return poly;
  }

  var ts = calculate(poly, opts);
  if (!ts.first) {
    // empty heap - straight line with all triangles empty
    return [poly[0], poly[poly.length - 1]];
  }
  eliminate(ts, limit - 2, opts); // limit is in points, and we are counting triangles
  return collect(ts.first);
}
