var Mustache, SVGO, Vinyl, fs, gutil, path, svgo, through2;

through2 = require('through2');

gutil = require('gulp-util');

Vinyl = require('vinyl');

path = require('path');

fs = require('fs');

Mustache = require('mustache');

SVGO = require('svgo');

svgo = new SVGO;

module.exports = function(opts) {
  var eachFile, endStream, parsedData;
  if (opts == null) {
    opts = {};
  }
  if (typeof opts === 'string') {
    opts = {
      name: opts
    };
  }
  if (opts.name == null) {
    opts.name = 'svg.css';
  }
  if (opts.prefix == null) {
    opts.prefix = 'svg-';
  }
  if (opts.postfix == null) {
    opts.postfix = '';
  }
  if (opts.template == null) {
    opts.template = fs.readFileSync(__dirname + '/template.mustache', 'utf8');
  }
  parsedData = {
    items: [],
    prefix: opts.prefix,
    postfix: opts.postfix
  };
  eachFile = function(file, enc, callback) {
    var error, fileName, svgCode;
    if (file.isStream()) {
      error = new gutil.PluginError('gulp-svg-to-css', 'Streams are not supported!');
      this.emit('error', error);
      callback();
      return;
    }
    if (!file.isBuffer()) {
      callback();
      return;
    }
    svgCode = file.contents.toString('utf8');
    fileName = path.parse(file.path).name;
    return svgo.optimize(svgCode, function(result) {
      parsedData.items.push({
        dataurl: 'data:image/svg+xml,' + encodeURIComponent(result.data),
        filename: fileName
      });
      return callback();
    });
  };
  endStream = function(callback) {
    var buffer, cssCode, template;
    template = "{{#items}}" + opts.template + "\r\n{{/items}}";
    cssCode = Mustache.render(template, parsedData);
    buffer = new Buffer(cssCode, 'utf8');
    this.push(new Vinyl({
      path: opts.name,
      contents: buffer
    }));
    return callback();
  };
  return through2.obj(eachFile, endStream);
};
