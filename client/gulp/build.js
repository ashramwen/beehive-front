'use strict';

var gulp = require('gulp');

var paths = gulp.paths;
var sass = require('gulp-sass');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('partials', function () {
  return gulp.src([
    paths.src + '/{app,components}/**/*.html',
    paths.tmp + '/{app,components}/**/*.html'
  ])
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: gulp.appName
    }))
    .pipe(gulp.dest(paths.tmp + '/partials/'));
});

gulp.task('html', ['inject', 'partials'], function () {
  var partialsInjectFile = gulp.src(paths.tmp + '/partials/templateCacheHtml.js', { read: false });
  var partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: paths.tmp + '/partials',
    addRootSlash: true
  };

  var htmlFilter = $.filter('*.html');
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');
  var assets;

  return gulp.src(paths.tmp + '/serve/*.html')
    .pipe($.inject(partialsInjectFile, partialsInjectOptions))
    .pipe(assets = $.useref.assets())
    .pipe($.rev())
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify({preserveComments: $.uglifySaveLicense}))
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.csso())
    .pipe(cssFilter.restore())
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(htmlFilter.restore())
    .pipe(gulp.dest(paths.dist + '/'))
    .pipe($.size({ title: paths.dist + '/', showFiles: true }));
});

gulp.task('images', function () {
  return gulp.src(paths.src + '/images/**/*')
    .pipe(gulp.dest(paths.dist + '/images/'));
});

gulp.task('fonts', function () {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest(paths.dist + '/fonts/'));
});

gulp.task('fonts-local', function(){
  return gulp.src(paths.src + '/fonts/*')
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest(paths.dist + '/fonts/'));
});

gulp.task('misc', function () {
  return gulp.src(paths.src + '/**/*.ico')
    .pipe(gulp.dest(paths.dist + '/'));
});

gulp.task('clean', function (done) {
  $.del([paths.dist + '/', paths.tmp + '/'], done);
});

 
gulp.task('sass', function () {
  return gulp.src(paths.src + '/app/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.src + '/app/css'));
});

gulp.task('config', function () {
  return gulp.src(paths.src + '/config.js')
    .pipe(gulp.dest(paths.dist + '/'));
});

gulp.task('bin', function(){
  return gulp.src(paths.src + '/bin/**/*')
    .pipe(gulp.dest(paths.dist + '/bin'));
});

gulp.task('dist', ['html', 'images', 'misc', 'fonts', 'fonts-local', 'config', 'bin']);
gulp.task('build',['sass','inject','partials','watch']);

gulp.task('mbower', function(){
  return gulp.src([paths.bower + '/**/*.{js,css,eot,svg,ttf,woff}'])
    .pipe(gulp.dest('../qa/bower_components'));
});

gulp.task('msrc', function(){
  return gulp.src([paths.src + '/**/*'])
    .pipe(gulp.dest('../qa/'));
});

gulp.task('qa', ['sass','inject','partials', 'mbower', 'msrc'], function(){
  return gulp.src([paths.tmp + '/serve/*.html'])
    .pipe(gulp.dest('../qa/'));
});