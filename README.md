# test-fixture [![NPM version](https://badge.fury.io/js/test-fixture.svg)](http://badge.fury.io/js/test-fixture) [![Build Status](https://travis-ci.org/kaelzhang/node-test-fixture.svg?branch=master)](https://travis-ci.org/kaelzhang/node-test-fixture) [![Dependency Status](https://gemnasium.com/kaelzhang/node-test-fixture.svg)](https://gemnasium.com/kaelzhang/node-test-fixture)

Copy test-fixtures to temp dir and get resolved file paths.

### Why?

I am tired of writing 

- `path.resolve(__dirname, 'test', 'fixtures')`, 
- `tmp.dir(callback)`, 
- `fse.copy(fixtures, dir)`
- `path.join(fixtures, 'file-a.js')`

EVERY DAY!

So, I got this.

## Install

```bash
$ npm install test-fixture --save
```

## Usage

```js
var fixtures = require('test-fixture');
var f = fixtures();

// copy test fixtures to the temp dir
f.copy(function(err, dir){
  f.resolve('a.js'); // '/<repo>/test/fixtures/a.js'
  f.dest('a.js'); // '/<temp>/a.js'
});
```

### fixtures(path...)

Arguments | Dir of test fixtures
--------- | --------------------
`undefined` | `test/fixtures`
`'a'` | `test/fixtures/a`
`'a'`, `'b'` | `test/fixtures/a/b`
`'/path/to'`(absolute) | `/path/to`
`'/path/to'`(absolute), `'a'` | `/path/to/a`

### .copy(callback)

- callback `function(err, dir)`
- err `Error`
- dir `path` the temporary directory for testing

Copy the test fixtures into a temporary directory.

### .resolve(path...)

Resolves the paths to get the path of the test fixtures

### .dest(path...)

Resolves the paths to get the path of the copied test fixtures

If `.copy()` is not ready, it will returns `null`

## Licence

MIT
<!-- do not want to make nodeinit to complicated, you can edit this whenever you want. -->