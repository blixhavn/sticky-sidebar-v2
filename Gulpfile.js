const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const babel = require("gulp-babel");
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const header = require('gulp-header');
const gutil = require('gulp-util');
const gru2 = require('gulp-rollup-2');
const resolve =  require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
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

gulp.task("babel", function(){
  return gulp.src("src/*.js")
    .pipe(babel())
    .pipe(gulp.dest("dist"));
});

gulp.task('bundle', gulp.series('babel', function(){
  return gulp.src(["dist/sticky-sidebar.js", "dist/jquery.sticky-sidebar.js"])
    .pipe(sourcemaps.write('.'))
    // transform the files here.
    .pipe(gru2.rollup({
      input: './dist/sticky-sidebar.js',
      external: ['window'],
      plugins: [ resolve(), commonjs() ],
      output: [
          {
              file: 'sticky-sidebar.js',
              name: 'StickySidebar',
              format: 'umd',
              globals: {window: 'window'}
          }
      ]
    }))
    .pipe(gru2.rollup({
        input: './dist/jquery.sticky-sidebar.js',
        external: ['window'],
        plugins: [ resolve(), commonjs() ],
        output: [
            {
                file: 'jquery.sticky-sidebar.js',
                format: 'umd',
                globals: {window: 'window'}
            }
        ]
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist'));
}));

gulp.task('uglify', gulp.series('bundle', function(){
  return gulp.src(["dist/sticky-sidebar.js", "dist/jquery.sticky-sidebar.js"])
    .pipe(uglify())
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(header(banner, {pkg}))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest("dist/"));
}));

gulp.task('watch', function() {
  gulp.watch('src/*.js', ['default']);
});

gulp.task('default', gulp.series(['babel', 'bundle', 'uglify']));