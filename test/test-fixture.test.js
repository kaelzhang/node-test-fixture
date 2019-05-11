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
    const {resolve, root} = fixtures(...paths)

    t.is(
      sub
        ? resolve(sub)
        : resolve(),
      expected
    )

    t.is(root, fixture())
  })
})

const COPY = [
  [],
  [path.join(__dirname, '..', 'tmp')]
]

COPY.forEach(([to]) => {
  test(`normal copy: ${to || 'temp'}`, async t => {
    const {resolve, copy} = fixtures('normal')
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

test('copy and install', async t => {
  const {resolve, copy} = fixtures('has-deps')
  await copy({
    install: true
  })

  require(resolve('index.js'))

  t.pass()
})

test('copy with clean', async t => {
  const to = fixture('should-clean')
  await fs.ensureDir(to)
  const {copy} = fixtures('normal')
  await copy({
    to,
    clean: true
  })

  t.pass()
})

test('copy with clean, ENOENT', async t => {
  const to = fixture('not-exists')
  try {
    await fs.remove(to)
  } catch (err) {
    // nothing
  }

  const {copy} = fixtures('normal')
  await copy({
    to,
    clean: true
  })

  t.pass()
})
