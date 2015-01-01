/*global require:false */
/*jslint node: true */
'use strict';
var gulp = require('gulp'),
  del = require('del'),
  concat = require('gulp-concat'),
  html2js = require('gulp-html2js'),
  userConfig = require('./build.config.js'),
  templates = [{base: 'src/app', src: userConfig.app_files.atpl, dest: '/templates-app.js'},
               {base: 'src/common', src: userConfig.app_files.ctpl, dest: '/templates-common.js'}];

gulp.task('clean', function (cb) {
  del('build', cb);
});

gulp.task('templates', ['clean'], function () {
  templates.forEach(function (template) {
    gulp.src(template.src)
      .pipe(html2js({
        useStrict: true,
        base: template.base
      }))
      .pipe(concat(template.dest))
      .pipe(gulp.dest(userConfig.build_dir));
  });

});


gulp.task('default', ['clean', 'templates'], function () {
  console.log(userConfig);
});