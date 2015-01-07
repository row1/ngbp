/*global require:false */
/*jslint node: true */
'use strict';
var gulp = require('gulp'),
  angularFilesort = require('gulp-angular-filesort'),
  bower = require('main-bower-files'),
  concat = require('gulp-concat'),
  del = require('del'),
  html2js = require('gulp-html2js'),
  inject = require("gulp-inject"),
  jshint = require('gulp-jshint'),
  less = require('gulp-less'),
  merge = require('merge-stream'),
  wrap = require("gulp-wrap"),
  userConfig = require('./build.config.js'),
  packageInfo = require('./package.json'),
  templates = [{base: 'src/app', src: userConfig.app_files.atpl, module: 'templates-app', dest: '/templates-app.js'},
               {base: 'src/common', src: userConfig.app_files.ctpl, module: 'templates-common', dest: '/templates-common.js'}];

gulp.task('clean', function (cb) {
  del('build', cb);
});

gulp.task('templates', ['clean'], function () {
  var calls = [];
  templates.forEach(function (template) {
    var call = gulp.src(template.src)
      .pipe(html2js({
        outputModuleName: template.module,
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
    .pipe(jshint.reporter('default'))
    .pipe(gulp.dest(userConfig.build_dir + '/src'));
});

gulp.task('styles', ['clean'], function () {
  return gulp.src(userConfig.app_files.less)
    .pipe(less())
    .pipe(concat(packageInfo.name + '-' + packageInfo.version + '.css'))
    .pipe(gulp.dest(userConfig.build_dir + '/assets'));
});

gulp.task('assets', ['clean'], function () {
  return gulp.src('src/assets/**')
    .pipe(gulp.dest(userConfig.build_dir + '/assets'));
});

gulp.task('vendor', ['clean'], function () {
  return gulp.src(bower()
            .concat(userConfig.vendor_files.js)
            .concat(userConfig.vendor_files.css)
            .concat(userConfig.vendor_files.assets))
      .pipe(gulp.dest(userConfig.build_dir + '/vendor'));
});

//TODO: Clean this up
gulp.task('index', ['templates', 'scripts', 'styles', 'assets', 'vendor'], function () {
  var target = gulp.src('./src/index.html'),
    cssSources = gulp.src([userConfig.build_dir + '/assets/**/*.css'], {read: false}),
    vendorJsSources = gulp.src(bower().concat(userConfig.vendor_files.js).concat(userConfig.vendor_files.css), {read: false}),
    appJsSources = gulp.src([userConfig.build_dir + '/src/**/*.js',
                        userConfig.build_dir + '/templates-*.js'], {read: true}),
    sources = [cssSources, vendorJsSources, appJsSources.pipe(angularFilesort())];

  return target.pipe(inject(merge(sources), {
    addRootSlash: false,
    transform: function (filePath, file, i, length) {
      var replacePathsForIndex = /build\/|(vendor\/).*[\\\/]/,
        correctedPath = filePath.replace(replacePathsForIndex, '$1'),
        ext = correctedPath.split('.').pop();
      if (ext === 'js') {
        return '<script src="' + correctedPath + '"></script>';
      } else if (ext === 'css') {
        return '<link rel="stylesheet" href="' + correctedPath + '"/>';
      } else {
        return '';
      }
   
    }
  }))
    .pipe(gulp.dest(userConfig.build_dir));
});


gulp.task('default', ['clean', 'templates', 'scripts', 'styles', 'assets', 'vendor', 'index'], function () {

});