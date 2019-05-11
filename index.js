const path = require('path')
const tmp = require('tmp-promise')
const fse = require('fs-extra')
const npminstall = require('npminstall')
const {isObject} = require('core-util-is')

class Fixtures {
  // @param {Array<string>} args
  constructor (...args) {
    this._root = this._root()
    this._path = path.resolve(this._root, ...args)

    this.resolve = this.resolve.bind(this)
    this.copy = this.copy.bind(this)
    this.install = this.install.bind(this)
    this.fixture = this.fixture.bind(this)
  }

  // Method for override
  // @returns the root of
  _root () {
    return path.resolve('test', 'fixtures')
  }

  get root () {
    return this._root
  }

  fixture (...args) {
    return path.resolve(this._root, ...args)
  }

  resolve (...args) {
    return path.resolve(this._path, ...args)
  }

  install (options = {}) {
    return npminstall({
      trace: false,
      // We cant disable spinners due to
      // https://github.com/cnpm/npminstall/issues/302
      detail: true,
      ...options,
      root: this._path
    })
  }

  async copy (options) {
    const {
      to,
      install = false,
      clean = false
    } = isObject(options)
      ? options
      : {
        to: options
      }

    if (to && clean) {
      try {
        await fse.remove(to)
      } catch (err) {
        // istanbul ignore next
        if (err.code !== 'ENOENT') {
          // istanbul ignore next
          throw err
        }
      }
    }

    const toDir = to
      ? to
      : (await tmp.dir()).path

    await fse.copy(this._path, toDir)
    this._path = toDir

    if (install) {
      await this.install()
    }

    return toDir
  }
}

module.exports = (...args) => new Fixtures(...args)
module.exports.Fixtures = Fixtures
