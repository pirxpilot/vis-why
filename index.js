var heap = require('code42day-binary-heap');

module.exports = simplify;

function areaLL(a, b, c) {
  return Math.abs(
    (a[0] - c[0]) * (b[1] - a[1]) -
    (a[0] - b[0]) * (c[1] - a[1])
  );
}


function areaCompare(p, q) {
  return p.area - q.area;
}


function calculate(poly, area) {
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
      area: area(a, b, c),
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


function eliminate(ts, limit, area) {
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
      prevTriangle.area = area(prevTriangle.a, prevTriangle.b, prevTriangle.c);
      ts.heap.push(prevTriangle);
    } else {
      ts.first = triangle.next;
    }
    if (nextTriangle) {
      ts.heap.remove(nextTriangle);
      nextTriangle.prev = triangle.prev;
      nextTriangle.a = triangle.a;
      nextTriangle.area = area(nextTriangle.a, nextTriangle.b, nextTriangle.c);
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


function simplify(poly, limit, area) {
  if (poly.length < 3) {
    return poly;
  }

  if (limit < 3) {
    return [poly[0], poly[poly.length - 1]];
  }

  if (poly.length <= limit) {
    return poly;
  }

  // default area function
  area = area || areaLL;

  var ts = calculate(poly, area);
  if (!ts.first) {
    // empty heap - straight line with all triangles empty
    return [poly[0], poly[poly.length - 1]];
  }
  eliminate(ts, limit - 2, area); // limit is in points, and we are counting triangles
  return collect(ts.first);
}
