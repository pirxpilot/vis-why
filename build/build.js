
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("code42day-binary-heap/index.js", Function("exports, require, module",
"module.exports = heap;\n\
\n\
\n\
function swap(heap, p, q) {\n\
  var t = heap[p];\n\
  heap[p] = heap[q];\n\
  heap[q] = t;\n\
}\n\
\n\
\n\
function up(heap, smaller, index) {\n\
  if (index <= 1) {\n\
    return;\n\
  }\n\
\n\
  var parent = Math.floor(index / 2);\n\
  if (smaller(index, parent)) {\n\
    swap(heap, parent, index);\n\
    up(heap, smaller, parent);\n\
  }\n\
}\n\
\n\
function down(heap, smaller, index) {\n\
  var left = 2 * index,\n\
    right = left + 1,\n\
    next = index;\n\
\n\
  if (left < heap.length && smaller(left, next)) {\n\
    next = left;\n\
  }\n\
  if (right < heap.length && smaller(right, next)) {\n\
    next = right;\n\
  }\n\
  if (next !== index) {\n\
    swap(heap, index, next);\n\
    down(heap, smaller, next);\n\
  }\n\
}\n\
\n\
function heap(compare) {\n\
  var data = [null]; // 1-index\n\
\n\
  compare = compare || function(a, b) { return a - b; };\n\
\n\
  function smaller(p, q) {\n\
    return compare(data[p], data[q]) < 0;\n\
  }\n\
\n\
  function push(item) {\n\
    data.push(item);\n\
    up(data, smaller, data.length - 1);\n\
  }\n\
\n\
  function pop() {\n\
    if (data.length === 1) {\n\
      return;\n\
    }\n\
    var root = data[1];\n\
    if (data.length === 2) {\n\
      data.length = 1;\n\
    } else {\n\
      data[1] = data.pop();\n\
      down(data, smaller, 1);\n\
    }\n\
    return root;\n\
  }\n\
\n\
  function size() {\n\
    return data.length - 1;\n\
  }\n\
\n\
  function get() {\n\
    return data.slice(1);\n\
  }\n\
\n\
  function remove(item) {\n\
    var fn, index = data.indexOf(item);\n\
\n\
    if (index < 0) {\n\
      return;\n\
    }\n\
    if (index === data.length - 1) {\n\
      data.pop();\n\
      return;\n\
    }\n\
\n\
    fn = smaller(data.length - 1, index) ? up : down;\n\
    data[index] = data.pop();\n\
    fn(data, smaller, index);\n\
  }\n\
\n\
  return {\n\
    push: push,\n\
    pop: pop,\n\
    size: size,\n\
    remove: remove,\n\
    get: get\n\
  };\n\
}//@ sourceURL=code42day-binary-heap/index.js"
));
require.register("vis-why/index.js", Function("exports, require, module",
"var heap = require(module.component ? 'binary-heap' : 'code42day-binary-heap');\n\
\n\
module.exports = simplify;\n\
\n\
\n\
\n\
function area(t) {\n\
  return Math.abs(\n\
    (t[0][0] - t[2][0]) * (t[1][1] - t[0][1]) -\n\
    (t[0][0] - t[1][0]) * (t[2][1] - t[0][1])\n\
  );\n\
}\n\
\n\
\n\
function areaCompare(p, q) {\n\
  return p.area - q.area;\n\
}\n\
\n\
\n\
function calculate(poly) {\n\
  var i, triangle, ts = {\n\
    heap: heap(areaCompare),\n\
    list: []\n\
  };\n\
\n\
  // calculate areas\n\
  for (i = 1; i < poly.length - 1; i++) {\n\
    triangle = poly.slice(i - 1, i + 2);\n\
    triangle.area = area(triangle);\n\
    if (triangle.area) {\n\
      ts.list.push(triangle);\n\
      ts.heap.push(triangle);\n\
    }\n\
  }\n\
\n\
  // link list\n\
  for(i = 0; i < ts.list.length; i++) {\n\
    triangle = ts.list[i];\n\
    triangle.prev = ts.list[i - 1];\n\
    triangle.next = ts.list[i + 1];\n\
  }\n\
\n\
  ts.first = ts.list[0];\n\
\n\
  return ts;\n\
}\n\
\n\
\n\
function eliminate(ts, limit) {\n\
  var triangle;\n\
\n\
  function reheap(triangle) {\n\
    ts.heap.remove(triangle);\n\
    triangle.area = area(triangle);\n\
    ts.heap.push(triangle);\n\
  }\n\
\n\
  while(ts.heap.size() > limit) {\n\
    triangle = ts.heap.pop();\n\
\n\
    // recalculate neighbors\n\
    if (triangle.prev) {\n\
      triangle.prev.next = triangle.next;\n\
      triangle.prev[2] = triangle[2];\n\
      reheap(triangle.prev);\n\
    } else {\n\
      ts.first = triangle.next;\n\
    }\n\
    if (triangle.next) {\n\
      triangle.next.prev = triangle.prev;\n\
      triangle.next[0] = triangle[0];\n\
      reheap(triangle.next);\n\
    }\n\
  }\n\
}\n\
\n\
\n\
function collect(triangle) {\n\
  var poly = [triangle[0], triangle[1]];\n\
\n\
  /* jshint -W084 */ // assignment below OK\n\
  while(triangle = triangle.next) {\n\
    poly.push(triangle[2]);\n\
  }\n\
  /* jshint +W084 */\n\
\n\
  return poly;\n\
}\n\
\n\
\n\
function simplify(poly, limit) {\n\
  if (poly.length < 3) {\n\
    return poly;\n\
  }\n\
\n\
  if (limit < 3) {\n\
    return [poly[0], poly[poly.length - 1]];\n\
  }\n\
\n\
\n\
  if (poly.length <= limit) {\n\
    return poly;\n\
  }\n\
\n\
  var ts = calculate(poly);\n\
  eliminate(ts, limit - 1); // limit is in points, and we are counting triangles\n\
  return collect(ts.first);\n\
}\n\
//@ sourceURL=vis-why/index.js"
));
require.alias("code42day-binary-heap/index.js", "vis-why/deps/binary-heap/index.js");
require.alias("code42day-binary-heap/index.js", "vis-why/deps/binary-heap/index.js");
require.alias("code42day-binary-heap/index.js", "binary-heap/index.js");
require.alias("code42day-binary-heap/index.js", "code42day-binary-heap/index.js");
require.alias("vis-why/index.js", "vis-why/index.js");