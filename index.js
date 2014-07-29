var heap = require(module.component ? 'binary-heap' : 'code42day-binary-heap');

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
      ts.heap.push(triangle);
    }
  }

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

  function reheap(triangle) {
    ts.heap.remove(triangle);
    triangle.area = area(triangle);
    ts.heap.push(triangle);
  }

  while(ts.heap.size() > limit) {
    triangle = ts.heap.pop();

    // recalculate neighbors
    if (triangle.prev) {
      triangle.prev.next = triangle.next;
      triangle.prev[2] = triangle[2];
      reheap(triangle.prev);
    } else {
      ts.first = triangle.next;
    }
    if (triangle.next) {
      triangle.next.prev = triangle.prev;
      triangle.next[0] = triangle[0];
      reheap(triangle.next);
    }
  }
}


function collect(triangle) {
  var poly = [triangle[0], triangle[1]];

  /* jshint -W084 */ // assignment below OK
  while(triangle = triangle.next) {
    poly.push(triangle[2]);
  }
  /* jshint +W084 */

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
  eliminate(ts, limit - 1); // limit is in points, and we are counting triangles
  return collect(ts.first);
}
