[![Build Status](https://travis-ci.org/kaelzhang/node-test-fixture.svg?branch=master)](https://travis-ci.org/kaelzhang/node-test-fixture)
[![Coverage](https://codecov.io/gh/kaelzhang/node-test-fixture/branch/master/graph/badge.svg)](https://codecov.io/gh/kaelzhang/node-test-fixture)

# test-fixture

Copy test fixtures to a temp dir and get resolved file paths.

### Why?

I am tired of writing these:

```js
path.resolve(__dirname, 'test', 'fixtures')
tmp.dir(callback)
fse.copy(fixtures, dir)
path.join(fixtures, 'some-file.js')
```

**EVERY DAY!**

So, I got this.

## Install

```bash
$ npm i test-fixture -D
```

## Usage

```js
// By default, it will use 'test/fixtures' dir.
const {copy, resolve} = require('test-fixture')()

// copy 'test/fixtures' to the temp dir
;(async () => {
  await copy()
  console.log(resolve('foo.js'))
  // '/<temp-dir>/foo.js'
})
```

### fixtures(...paths): {resolve, copy, install}

- **paths** `Array<path>` to define the root paths of the fixtures, which is similar as

Defines the root of the fixture

```js
const path = require('path')
const fixturesRoot = path.resolve(projectRoot, 'test', 'fixtures')

path.resolve(fixturesRoot, ...args)
```

`arguments` | `base`(dir of test fixtures)
--------- | --------------------
`undefined` | `test/fixtures`
`'a'` | `test/fixtures/a`
`'a'`, `'b'` | `test/fixtures/a/b`
`'/path/to'` (absolute) | `/path/to`
`'/path/to'` (absolute), `'a'` | `/path/to/a`

Actually, the `base` is `path.resolve('text/fixtures', path...)`

### await copy(options?)
### await copy(to?)

- **options?** `Object`
  - **to?** `path=` the destination folder where the test fixtures will be copied to. If not specified, a temporary directory will be used.
  - **install?** `boolean=false` whether should run npm install after copying

Copy the test fixtures into another directory.

```js
copy('/path/to')

// is equivalent to
copy({
  to: '/path/to',
  install: false
})
```

### resolve(...paths)

Resolves the paths to get the path of the test fixtures

After `.copy()`ed, it will resolve paths based on the destination dir.

If not, it will use the base dir. But never use both of them simultaneously.

```
/path/to/<base>
             |-- a.js
/path/to/<to>
           |-- a.js
```

### install(...pkgs)

- **pkgs?** `Array<{name: string, version: string}>` packages to install

Install packages in the working directory. If run after `await copy()`, then it will install packages in the directory which fixtures copied to.

#### Without copying

```js
const {resolve} = fixtures(base)
resolve('a.js')  // -> /path/to/<base>/a.js
```

#### Using `.copy()`

```js
const {copy, resolve} = fixtures(base)

await copy('/path/to')

resolve('a.js') // -> /path/to/a.js
```

## License

[MIT](LICENSE)
