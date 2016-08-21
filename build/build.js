var fs = require('fs');
var rollup = require('rollup');
var uglify = require('uglify-js');
var babel = require('rollup-plugin-babel');
var package = require('../package.json');
var banner =
    "/*!\n" +
    " * vue-formly v" + package.version + "\n" +
    " * https://github.com/matt-sanders/vue-formly\n" +
    " * Released under the MIT License.\n" +
    " */\n";

rollup.rollup({
  entry: 'src/index.js',
  plugins: [
    babel({
      presets: ['es2015-loose-rollup']
    })
  ]
})
.then(function (bundle) {
  return write('dist/vue-formly.js', bundle.generate({
    format: 'umd',
    banner: banner,
    moduleName: 'VueFormly'
  }).code, bundle);
})
.then(function (bundle) {
  return write('dist/vue-formly.min.js',
    banner + '\n' + uglify.minify('dist/vue-formly.js').code,
  bundle);
})
.then(function (bundle) {
  return write('dist/vue-formly.es2015.js', bundle.generate({
    banner: banner,
      //footer: 'export { Url, Http, Resource };'
  }).code, bundle);
})
.then(function (bundle) {
  return write('dist/vue-formly.common.js', bundle.generate({
    format: 'cjs',
    banner: banner
  }).code, bundle);
})
.catch(logError);

function write(dest, code, bundle) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(dest, code, function (err) {
      if (err) return reject(err);
      console.log(blue(dest) + ' ' + getSize(code));
      resolve(bundle);
    });
  });
}

function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb';
}

function logError(e) {
  console.log(e);
}

function blue(str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m';
}