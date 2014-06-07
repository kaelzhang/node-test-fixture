'use strict';

module.exports = fixtures;

var node_path = require('path');
var tmp = require('tmp');
var fse = require('fs-extra');
var _ = require('underscore');

// @param {path...}
function fixtures () {
  var root = node_path.resolve('test', 'fixtures');
  var path = fixtures._resolve(root, arguments);
  return new Fixtures(path);
}

function Fixtures (path) {
  this.path = path;
};


// @param {path...} arguments
Fixtures.prototype.resolve = function() {
  return fixtures._resolve(this.path, arguments);
};


// @param {path...} arguments
Fixtures.prototype.dest = function() {
  return fixtures._resolve(this.dir, arguments);
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

      self.dir = dir;
      callback(err, dir);
    });
  });
};

