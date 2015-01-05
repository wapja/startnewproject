var gulp          = require('gulp');
var argv          = require('yargs').argv;
var del           = require('del');
var ngAnnotate    = require('gulp-ng-annotate');
var concat        = require('gulp-concat');
var gulpif        = require('gulp-if');
var uglify        = require('gulp-uglify');
var minifyCSS     = require('gulp-minify-css');
var templateCache = require('gulp-angular-templatecache');
var connect       = require('gulp-connect');
var karma = require('karma').server;

var skipClean     = false;

gulp.task('clean', function(cb) {

  if (skipClean) {
    del(['none'], cb);
  } else {
    del(['dist'], cb);
  }
});

gulp.task('modules', ['clean'], function() {
  return gulp.src(['./app/**/*.module.js'])
  .pipe(ngAnnotate())
  .pipe(concat('modules.js'))
  .pipe(gulpif(argv.build, uglify()))
  .pipe(gulp.dest('./dist/js'))
  .pipe(connect.reload());
});

gulp.task('scripts', ['clean'], function() {
  return gulp.src(['!./app/**/*.module.js', './app/**/*.*.js'])
    .pipe(ngAnnotate())
    .pipe(concat('app.js'))
    .pipe(gulpif(argv.build, uglify()))
    .pipe(gulp.dest('./dist/js'))
    .pipe(connect.reload());
});

gulp.task('vendorJs', ['clean'], function() {

  return gulp.src(['./bower_components/angular/*.min.js',
        './bower_components/angular-mocks/*.min.js',
        './bower_components/angular-route/angular-route.js',
        './bower_components/lodash/dist/lodash.min.js',
        './bower_components/restangular/dist/restangular.min.js'
    ])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('templates', ['clean'], function(){
    //combine all template files of the app into a js file
    return gulp.src(['!./app/index.html', './app/**/*.html'])
      .pipe(templateCache('templates.js',{standalone:true}))
      .pipe(gulp.dest('./dist/js'))
      .pipe(connect.reload());
});

gulp.task('css', ['clean'], function(){
    return gulp.src(['./app/**/*.css'])
      .pipe(concat('app.css'))
      .pipe(gulpif(argv.build, minifyCSS()))
      .pipe(gulp.dest('./dist/css'))
      .pipe(connect.reload());
});

gulp.task('vendorCss', ['clean'], function(){
    //concatenate vendor CSS files
    return gulp.src(['!./bower_components/**/*.min.css',
        './bower_components/**/*.css'])
        .pipe(concat('vendor.css'))
        .pipe(gulpif(argv.build, minifyCSS()))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('copy-index', ['clean'], function() {
    return gulp.src('./app/index.html')
        .pipe(gulp.dest('./dist'))
        .pipe(connect.reload());
});

gulp.task('copy-fonts', ['clean'], function() {
    return gulp.src('./bower_components/bootstrap-css-only/fonts/*.*')
        .pipe(gulp.dest('./dist/fonts'));
});

gulp.task("init", [
  'copy-index',
  'copy-fonts'
]);

gulp.task("compile", []);

gulp.task("compress", [
  'modules',
  'scripts',
  'vendorJs',
  'templates',
  'css',
  'vendorCss',
]);

gulp.task('watch',function() {

  skipClean       = true;
  gulp.watch(['./app/**/*.module.js'],['scripts']);
  gulp.watch(['./app/**/*.*.js','!./app/**/*.module.js'],['scripts']);
  gulp.watch(['!./app/index.html','./app/**/*.html'],['templates']);
  gulp.watch('./app/**/*.css',['css']);
  gulp.watch('./app/index.html',['copy-index']);
});

/**
* Watch for file changes and re-run tests on each change
*/
gulp.task('tdd', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, done);
});

gulp.task('connect', connect.server({
  root: ['dist'],
  port: 9000,
  livereload: true
}));

gulp.task("default", [
  "init",
  "compile",
  "compress",
  "tdd",
  "connect",
  "watch"
]);
