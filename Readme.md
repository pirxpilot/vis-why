[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][gemnasium-image]][gemnasium-url]

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

[code42day]: http://code42day.com
[component(1)]: http://component.io
[npm]: https://www.npmjs.org/
[vis-why]: https://hydra.hull.ac.uk/resources/hull:8338

[npm-image]: https://img.shields.io/npm/v/code42day-vis-why.svg
[npm-url]: https://npmjs.org/package/code42day-vis-why

[travis-url]: https://travis-ci.org/code42day/vis-why
[travis-image]: https://img.shields.io/travis/code42day/vis-why.svg

[gemnasium-image]: https://img.shields.io/gemnasium/code42day/vis-why.svg
[gemnasium-url]: https://gemnasium.com/code42day/vis-why
