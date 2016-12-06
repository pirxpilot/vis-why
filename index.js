var heap = require('code42day-binary-heap');

module.exports = simplify;

function area(t) {
  return Math.abs(
    (t[0][0] - t[2][0]) * (t[1][1] - t[0][1]) -
    (t[0][0] - t[1][0]) * (t[2][1] - t[0][1])
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

  // calculate areas
  for (i = 1; i < poly.length - 1; i++) {
    triangle = poly.slice(i - 1, i + 2);
    triangle.area = area(triangle);
    if (triangle.area) {
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
  var triangle,
    prevTriangle,
    nextTriangle;

  while(ts.heap.size() > limit) {
    triangle = ts.heap.pop();
    prevTriangle = triangle.prev;
    nextTriangle = triangle.next;

    // recalculate neighbors
    if (prevTriangle) {
      ts.heap.remove(prevTriangle);
      prevTriangle.next = triangle.next;
      prevTriangle[2] = triangle[2];
      prevTriangle.area = area(prevTriangle);
      ts.heap.push(prevTriangle);
    } else {
      ts.first = triangle.next;
    }
    if (nextTriangle) {
      ts.heap.remove(nextTriangle);
      nextTriangle.prev = triangle.prev;
      nextTriangle[0] = triangle[0];
      nextTriangle.area = area(nextTriangle);
      ts.heap.push(nextTriangle);
    }
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
