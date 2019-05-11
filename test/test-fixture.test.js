const test = require('ava')
const path = require('path')
const fs = require('fs-extra')
const fixtures = require('..')

function expect (t, from, to, name) {
  t.is(
    ...[from, to]
    .map(dir => path.join(dir, name))
    .map(p => fs.readFileSync(p).toString())
  )
}

const fixture = (...args) => path.join(__dirname, 'fixtures', ...args)

const PATHS = [
  [[], fixture()],
  [['a'], fixture('a')],
  [['a', 'b'], fixture('a', 'b')],
  [['/path/to'], '/path/to'],
  [['/path/to', 'a'], '/path/to/a'],
  [['/path/to', 'a'], '/path/to/a/b', 'b'],
]

PATHS.forEach(([paths, expected, sub]) => {
  test(`resolve: fixtures(...${JSON.stringify(paths)}), resolve(${sub})`, async t => {
    const {resolve} = fixtures(...paths)

    t.is(
      sub
        ? resolve(sub)
        : resolve(),
      expected
    )
  })
})

const COPY = [
  [],
  [path.join(__dirname, '..', 'tmp')]
]

COPY.forEach(([to]) => {
  test(`copy: ${to ? 'temp' : to}`, async t => {
    const {resolve, copy} = fixtures()
    const from = resolve()

    const dir = to
      ? await copy(to)
      : await copy()

    if (to) {
      t.is(dir, to)
    }

    expect(t, from, dir, 'a.js')
    expect(t, from, dir, 'c')
  })
})
