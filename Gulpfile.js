'use strict';

//npm install -g jshint
//npm install --save-dev jshint
//npm install gulp gulp-minify-css gulp-uglify gulp-clean gulp-cleanhtml gulp-jshint gulp-strip-debug gulp-zip gulp-bump --save-dev

var gulp = require('gulp'),
    clean = require('gulp-clean'),
    cleanhtml = require('gulp-cleanhtml'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    stripdebug = require('gulp-strip-debug'),
    uglify = require('gulp-uglify'),
    zip = require('gulp-zip'),
    bump = require('gulp-bump');

//clean build directory
gulp.task('clean', function() {
    return gulp.src(['build/*', 'dist/*'], {read: false})
        .pipe(clean());
});

gulp.task('bump', function(){
  gulp.src('./src/manifest.json')
  .pipe(bump())
  .pipe(gulp.dest('./src'));
});

//copy static folders to build directory
gulp.task('copy', function() {
    gulp.src('src/img/**')
        .pipe(gulp.dest('build/img'));
    gulp.src('src/_locales/**')
        .pipe(gulp.dest('build/_locales'));
    gulp.src('src/semantic/**')
        .pipe(gulp.dest('build/semantic'));
    return gulp.src('src/manifest.json')
        .pipe(gulp.dest('build'));
});

//copy and compress HTML files
gulp.task('html', function() {
    return gulp.src('src/*.html')
        .pipe(cleanhtml())
        .pipe(gulp.dest('build'));
});

//run scripts through JSHint
gulp.task('jshint', function() {
    return gulp.src('src/scripts/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

//copy vendor scripts and uglify all other scripts, creating source maps
gulp.task('scripts', ['jshint'], function() {
    return gulp.src(['src/js/**/*.js'])
        .pipe(stripdebug())
        .pipe(uglify({outSourceMap: true}))
        .pipe(gulp.dest('build/js/'));
});

//minify styles
gulp.task('styles', function() {
//  return gulp.src('src/styles/**/*.css')
//      .pipe(minifycss({root: 'src/styles', keepSpecialComments: 0}))
//      .pipe(gulp.dest('build/styles'));
    return gulp.src('src/css/**')
        .pipe(gulp.dest('build/css'));
});

//build ditributable and sourcemaps after other tasks completed
gulp.task('zip', ['html', 'scripts', 'styles', 'copy'], function() {
    var manifest = require('./src/manifest'),
        distFileName = 'SaPi_v' + manifest.version + '.zip',
        mapFileName = 'SaPi_v' + manifest.version + '-maps.zip';
    //collect all source maps
    gulp.src('build/scripts/**/*.map')
        .pipe(zip(mapFileName))
        .pipe(gulp.dest('dist'));
    //build distributable extension
    return gulp.src(['build/**', '!build/scripts/**/*.map'])
        .pipe(zip(distFileName))
        .pipe(gulp.dest('dist'));
});

//run all tasks after build directory has been cleaned
gulp.task('default', ['bump', 'clean'], function() {
    gulp.start('zip');
});