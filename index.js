const path = require('path')
const tmp = require('tmp-promise')
const fse = require('fs-extra')

class Fixtures {
  // @param {Array<string>} args
  constructor (...args) {
    this._root = this._root()
    this._path = path.resolve(this._root, ...args)

    this.resolve = this.resolve.bind(this)
    this.copy = this.copy.bind(this)
  }

  // Method for override
  // @returns the root of
  _root () {
    return path.resolve('test', 'fixtures')
  }

  resolve (...args) {
    return args.length === 0
      ? this._path
      : path.resolve(this._path, ...args)
  }

  async copy (to) {
    const toDir = to
      ? to
      : (await tmp.dir()).path

    await fse.copy(this._path, toDir)
    return this._path = toDir
  }
}

module.exports = (...args) => new Fixtures(...args)
