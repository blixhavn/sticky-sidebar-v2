const gulp = require("gulp");
const babel = require("gulp-babel");
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const header = require('gulp-header');
const { rollup } = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const fs = require('fs');
const pkg = require('./package.json');

const banner = [
  '/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @author <%= pkg.author %>',
  ' * @license <%= pkg.license %>',
  '**/',
  '',
].join('\n');

// Each step reads from a different directory than it writes to. Reading inputs from
// dist/ while the same build wrote to it made the output depend on timing.

function clean(){
  return Promise.all(['build', 'dist'].map((dir) => fs.promises.rm(dir, {recursive: true, force: true})));
}

function compile(){
  return gulp.src("src/*.js")
    .pipe(babel())
    .pipe(gulp.dest("build"));
}

function core(){
  return gulp.src("build/sticky-sidebar.js")
    .pipe(gulp.dest("dist"));
}

// The plugin only registers itself on jQuery. Importing it from a side-effect-only
// entry keeps the bundle from exporting anything, so it defines no global of its own.
const jQueryEntry = {
  name: 'jquery-entry',
  resolveId: (id) => 'jquery-entry' === id ? id : null,
  load: (id) => 'jquery-entry' === id ? "import './build/jquery.sticky-sidebar.js';" : null
};

async function bundleJQuery(){
  const bundle = await rollup({
    input: 'jquery-entry',
    external: ['window'],
    plugins: [ jQueryEntry, resolve(), commonjs() ]
  });

  await bundle.write({
    file: 'dist/jquery.sticky-sidebar.js',
    format: 'umd',
    globals: {window: 'window'}
  });
}

function minify(){
  return gulp.src(["dist/sticky-sidebar.js", "dist/jquery.sticky-sidebar.js"])
    .pipe(uglify())
    .pipe(header(banner, {pkg}))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest("dist"));
}

const build = gulp.series(clean, compile, gulp.parallel(core, bundleJQuery), minify);

gulp.task('watch', function() {
  gulp.watch('src/*.js', build);
});

gulp.task('default', build);
