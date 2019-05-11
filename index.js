const path = require('path')
const tmp = require('tmp-promise')
const fse = require('fs-extra')

class Fixtures {
  // @param {Array<string>} args
  constructor (...args) {
    this._root = this._root()
    this._path = fixtures._resolve(this._root, ...args)
  }

  // Method for override
  // @returns the root of
  _root () {
    return path.resolve('test', 'fixtures')
  }

  resolve (...args) {
    return path.resolve(this._path, ...args)
  }

  async copy (to) {
    const toDir = to
      ? to
      : (await tmp.dir()).path

    await fse.copy(this._path, toDir)
    this._path = toDir
  }
}

const fixtures = module.exports = (...args) => new Fixtures(...args)
