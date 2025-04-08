import heap from 'sterta';

function areaLL(a, b, c) {
  return Math.abs(
    (a[0] - c[0]) * (b[1] - a[1]) - (a[0] - b[0]) * (c[1] - a[1])
  );
}

function areaCompare(p, q) {
  return p.area - q.area;
}

function calculate(poly, area) {
  const ts = { heap: heap(areaCompare, true) };
  let triangle;
  let trianglePrev;
  let a = poly[0];
  let b;
  let c = poly[1];
  const list = [];

  // calculate areas
  for (let i = 2; i < poly.length; i++) {
    b = c;
    c = poly[i];
    triangle = {
      a,
      b,
      c,
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
  let triangle;
  let prevTriangle;
  let nextTriangle;
  let counter = ts.heap.size() - limit;

  while (counter-- > 0) {
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
  const poly = [triangle.a];

  while (true) {
    poly.push(triangle.b);
    if (!triangle.next) {
      break;
    }
    triangle = triangle.next;
  }

  poly.push(triangle.c);

  return poly;
}

export default function simplify(poly, limit, area = areaLL) {
  if (poly.length < 3) {
    return poly;
  }

  if (limit < 3) {
    return [poly[0], poly[poly.length - 1]];
  }

  if (poly.length <= limit) {
    return poly;
  }

  const ts = calculate(poly, area);
  if (!ts.first) {
    // empty heap - straight line with all triangles empty
    return [poly[0], poly[poly.length - 1]];
  }
  eliminate(ts, limit - 2, area); // limit is in points, and we are counting triangles
  return collect(ts.first);
}
