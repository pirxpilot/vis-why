var heap = require('code42day-pairing-heap');

module.exports = simplify;

function area(a, b, c) {
  return Math.abs(
    (a[0] - c[0]) * (b[1] - a[1]) -
    (a[0] - b[0]) * (c[1] - a[1])
  );
}


function calculate(poly) {
  var i,
    ts = { heap: heap() },
    triangle,
    trianglePrev,
    a = poly[0], b = poly[1], c;

  // calculate areas
  for (i = 2; i < poly.length; i++) {
    c = poly[i];
    triangle = {
      _id: i,
      a: a,
      b: b,
      c: c,
      next: null,
      prev: trianglePrev,
      _: heap._(area(a, b, c))
    };
    a = b;
    b = c;
    if (!triangle._.key) {
      continue;
    }
    if (trianglePrev) {
      trianglePrev.next = triangle;
    }
    ts.heap.push(triangle);
    trianglePrev = triangle;
    if (!ts.first) {
      ts.first = triangle;
    }
  }

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
      prevTriangle.next = triangle.next;
      prevTriangle.c = triangle.c;
      ts.heap.update(prevTriangle, area(prevTriangle.a, prevTriangle.b, prevTriangle.c));
    } else {
      ts.first = triangle.next;
    }
    if (nextTriangle) {
      nextTriangle.prev = triangle.prev;
      nextTriangle.a = triangle.a;
      ts.heap.update(nextTriangle, area(nextTriangle.a, nextTriangle.b, nextTriangle.c));
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
