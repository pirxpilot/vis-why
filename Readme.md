
# vis-why

  M Visvalingam and J D Whyatt line simplification algorithm
  Implementation based on [Mike Bostock's code](http://bost.ocks.org/mike/simplify/) but without a d3 dependency.

  Live demo is [here](http://code42day.github.io/vis-why/)

## Installation

  Install with [component(1)]:

    $ component install code42day/vis-why


  Install with [npm]:

    $ npm install vis-why

## API

### `simplify(polyline, limit)`

Simplify polyline by [repeated elimination of the smallest][vis-why] area.

- `polyline` - array of points representing a polyline, each point represented by coordinate array `[x, y]`
- `limit` - number of points/vortexes that will remain in the resulting polyline



## License

  The MIT License (MIT)

  Copyright (c) 2014 <[code42day]>

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.

[code42day]: http://code42day.com
[component(1)]: http://component.io
[npm]: https://www.npmjs.org/
[vis-why]: https://hydra.hull.ac.uk/resources/hull:8338