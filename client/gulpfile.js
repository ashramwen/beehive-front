'use strict';

var gulp = require('gulp');

gulp.paths = {
  src: 'src',
  dist: 'dist',
  tmp: '.tmp',
  bower: 'bower_components',
  e2e: 'e2e',
  appPath: 'src/',
  appStructFile: 'construct.json',
  templatePath: 'app_templates/'
};
gulp.appName = 'BeehivePortal';

require('require-dir')('./gulp');

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});
