var heap = require('code42day-binary-heap');

module.exports = simplify;

function area(a, b, c) {
  return Math.abs(
    (a[0] - c[0]) * (b[1] - a[1]) -
    (a[0] - b[0]) * (c[1] - a[1])
  );
}


function areaCompare(p, q) {
  return p.area - q.area;
}


function calculate(poly) {
  var i,
    ts = { heap: heap(areaCompare, true) },
    triangle,
    trianglePrev,
    list = [];

  // calculate areas
  for (i = 1; i < poly.length - 1; i++) {
    triangle = {
      a: poly[i - 1],
      b: poly[i],
      c: poly[i + 1],
      area: 0,
      next: null,
      prev: null,
      _heapIndex: 0
    };
    triangle.area = area(triangle.a, triangle.b, triangle.c);
    if (!triangle.area) {
      continue;
    }
    if (trianglePrev) {
      trianglePrev.next = triangle;
      triangle.prev = trianglePrev;
    }
    list.push(triangle);
    trianglePrev = triangle;
  }

  ts.first = list[0];

  // create a heap
  ts.heap.rebuild(list);

  return ts;
}


function eliminate(ts, limit) {
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
  return collect(ts.first);
}
