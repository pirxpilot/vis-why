var heap = require('code42day-binary-heap');

module.exports = simplify;

function area(t, index) {
  var
    a = t[index],
    b = t[index - 1],
    c = t[index + 1];

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
    list: []
  };
  var ta;

  // calculate areas
  for (i = 1; i < poly.length - 1; i++) {
    ta = area(poly, i);
    if (ta) {
      triangle = poly.slice(i - 1, i + 2);
      triangle.area = ta;
      ts.list.push(triangle);
    }
  }

  // create a heap
  ts.heap.rebuild(ts.list);

  // link list
  for(i = 0; i < ts.list.length; i++) {
    triangle = ts.list[i];
    triangle.prev = ts.list[i - 1];
    triangle.next = ts.list[i + 1];
  }

  ts.first = ts.list[0];

  return ts;
}


function eliminate(ts, limit) {
  var triangle;

  while(ts.heap.size() > limit) {
    triangle = ts.heap.pop();

    // recalculate neighbors
    if (triangle.prev) {
      triangle.prev.next = triangle.next;
      triangle.prev[2] = triangle[2];
      triangle.prev.area = area(triangle.prev, 1);
    } else {
      ts.first = triangle.next;
    }
    if (triangle.next) {
      triangle.next.prev = triangle.prev;
      triangle.next[0] = triangle[0];
      triangle.next.area = area(triangle.next, 1);
    }
    // some areas have changed - need to adjust the heap
    ts.heap.rebuild();
  }
}


function collect(triangle) {
  var poly = [triangle[0]];

  while(true) {
    poly.push(triangle[1]);
    if (!triangle.next) {
      break;
    }
    triangle = triangle.next;
  }

  poly.push(triangle[2]);

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
  eliminate(ts, limit - 2); // limit is in points, and we are counting triangles
  if (!ts.first) {
    // empty heap - straight line with all triangles empty
    return [poly[0], poly[poly.length - 1]];
  }
  return collect(ts.first);
}
