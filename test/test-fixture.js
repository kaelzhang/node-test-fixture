'use strict';

var expect = require('chai').expect;
var fixtures = require('../');
var node_path = require('path');
var fs = require('fs');

var root = node_path.join(__dirname, 'fixtures');

function expect_file (from, to, name) {
  from = node_path.join(from, name);
  to = node_path.join(to, name);
  expect(fs.readFileSync(from).toString()).to.equal(fs.readFileSync(to).toString());
}


describe("fixtures()", function(){
  it("absolute", function(done){
    var f = fixtures(__dirname);
    expect(f.path).to.equal(__dirname);
    done();
  });

  it("absolute a", function(done){
    var f = fixtures(__dirname, 'a');
    expect(f.path).to.equal(node_path.join(__dirname, 'a'));
    done();
  });

  it("absolute a b", function(done){
    var f = fixtures(__dirname, 'a', 'b');
    expect(f.path).to.equal(node_path.join(__dirname, 'a', 'b'));
    done();
  });

  it("a", function(done){
    var f = fixtures('a');
    expect(f.path).to.equal(node_path.join(root, 'a'));
    done();
  });

  it("a b", function(done){
    var f = fixtures('a', 'b');
    expect(f.path).to.equal(node_path.join(root, 'a', 'b'));
    done();
  });

  it("undefined", function(done){
    var f = fixtures();
    expect(f.path).to.equal(node_path.join(root));
    done();
  });
});

describe(".copy", function(){
  it("copy files", function(done){
    var f = fixtures();
    f.copy(function (err, dir) {
      done();
      if (err) {
        return; 
      }

      expect_file(f.path, dir, 'a.js');
      expect_file(f.path, dir, 'c');
    });
  });
});


describe(".resolve()", function(){
  it("resolve file", function(done){
    var f = fixtures('a');
    var path = node_path.join(root, 'a');
    expect(f.resolve('a')).to.equal(node_path.join(path, 'a'));
    expect(f.resolve()).to.equal(path);
    done()
  });
});

describe(".dest()", function(){
  it("null", function(done){
    var f = fixtures('a');
    expect(f.dest('a')).to.equal(null);
    expect(f.dest()).to.equal(null);
    done()
  });

  it("a", function(done){
    var f = fixtures('a');
    f.copy(function (err, dir) {
      done();
      if (err) {
        return;
      }
      var path = dir;
      expect(f.dest('a')).to.equal(node_path.join(path, 'a'));
      expect(f.dest()).to.equal(path);
    });
  });
});

