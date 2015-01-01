/*global require:false */
/*jslint node: true */
'use strict';
var gulp = require('gulp'),
  del = require('del'),
  merge = require('merge-stream'),
  concat = require('gulp-concat'),
  jshint = require('gulp-jshint'),
  html2js = require('gulp-html2js'),
  wrap = require("gulp-wrap"),
  userConfig = require('./build.config.js'),
  templates = [{base: 'src/app', src: userConfig.app_files.atpl, dest: '/templates-app.js'},
               {base: 'src/common', src: userConfig.app_files.ctpl, dest: '/templates-common.js'}];

gulp.task('clean', function (cb) {
  del('build', cb);
});

gulp.task('templates', ['clean'], function () {
  var calls = [];
  templates.forEach(function (template) {
    var call = gulp.src(template.src)
      .pipe(html2js({
        useStrict: true,
        base: template.base
      }))
      .pipe(concat(template.dest))
      .pipe(gulp.dest(userConfig.build_dir));
    calls.push(call);
  });
  return merge.apply(this, calls);
});

gulp.task('scripts', ['clean'], function () {
  return gulp.src(userConfig.app_files.js)
    .pipe(wrap('(function(){ "use strict"; <%= contents %> })();'))
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'));
});


gulp.task('default', ['clean', 'templates', 'scripts'], function () {
  //console.log(userConfig);
});