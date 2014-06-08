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
var f = fixtures(); // by default, it will use 'test/fixtures' dir.

// copy 'test/fixtures' to the temp dir
f.copy(function(err, dir){
  f.resolve('a.js'); // '/<temp>/a.js'
});
```

### fixtures([path...])

`arguments` | `base`(dir of test fixtures)
--------- | --------------------
`undefined` | `test/fixtures`
`'a'` | `test/fixtures/a`
`'a'`, `'b'` | `test/fixtures/a/b`
`'/path/to'`(absolute) | `/path/to`
`'/path/to'`(absolute), `'a'` | `/path/to/a`

Actually, the `base` is `path.resolve('text/fixtures', path...)`

### .copy([to], callback)

- to `path=` the destination folder where the test fixtures will be copied to. If not specified, `fixtures` will create a temporary dir.
- callback `function(err, dir)`
- err `Error`
- dir `path` the destination directory for testing

Copy the test fixtures into a temporary directory.

### .resolve([path...])

Resolves the paths to get the path of the test fixtures

After `.copy()`ed, it will resolve paths based on the destination dir. 

If not, it will use the base dir. But never use both of them simultaneously.

```
/path/to/<base>
             |-- a.js
/path/to/<to>
           |-- a.js
```

#### Without copying

```js
var f = fixtures(base);
f.resolve('a.js'); // -> /path/to/<base>/a.js
```

#### Using `.copy()`

```js
var f = fixtures(base);
f.copy(to, function(err, dir){
  if (err) {
    return;
  }
  f.resolve('a.js'); // -> /path/to/<to>/a.js
});
``` 


## For Implementors

### fixtures.Fixtures(args)

- args `Arguments|Array` paths to join

### Override: ._root()

Returns `path` the base root. By default, it will returns 'test/fixtures', but you can override this method to specify it by your own.

## License

MIT
<!-- do not want to make nodeinit to complicated, you can edit this whenever you want. -->