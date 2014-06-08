'use strict';

module.exports = fixtures;
fixtures.Fixtures = Fixtures;

var node_path = require('path');
var tmp = require('tmp');
var fse = require('fs-extra');
var _ = require('underscore');

// @param {path...}
function fixtures () {
  return new Fixtures(arguments);
}

// @param {Arguments|Array} args
function Fixtures (args) {
  this.root = this._root();
  this.path = fixtures._resolve(this.root, args);
};


// Method for override
// @returns the root of 
Fixtures.prototype._root = function() {
  return node_path.resolve('test', 'fixtures');
};


// @param {path...} arguments
Fixtures.prototype.resolve = function() {
  return fixtures._resolve(this.path, arguments);
};


// @param {path} root
// @param {arguments} paths
fixtures._resolve = function(root, paths) {
  if (!root) {
    return null;
  }

  // 'a' -> '/path/to/test/fixtures/a'
  // '/path/to/a' -> 'path/to/a'
  // undefined -> '/path/to/fixtures'
  // see README.md for details
  paths = [root].concat(_.toArray(paths));
  return node_path.resolve.apply(node_path, paths);
};


Fixtures.prototype.copy = function(callback) {
  var self = this;
  tmp.dir(function (err, dir) {
    if (err) {
      return callback(err);
    }

    fse.copy(self.path, dir, function (err) {
      if (err) {
        return callback(err);
      }

      self.path = dir;
      callback(err, dir);
    });
  });
};
