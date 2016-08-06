"use strict";

const gulp = require('gulp'),
      path = require('path'),
      ts = require('gulp-typescript'),
      sass = require("gulp-sass"),
      sourcemaps = require('gulp-sourcemaps'),
      jasmine = require('gulp-jasmine');

var paths = {
    webroot: "./wwwroot/",
    npm: './node_modules/'
};

paths.lib = paths.webroot + 'lib/';
paths.app = paths.webroot + "app/";
paths.sass = paths.app + "**/*.scss";
paths.typescript = "./**/*.ts";
paths.ignore = {
    npm: '!' + paths.npm + '/**'
};

var libs = {
    'es6-shim': {
        libs: [
            paths.npm + 'es6-shim/es6-shim.js'
        ]
    },
    'systemjs': {
        libs: [
            paths.npm + 'systemjs/dist/system.js',
            paths.npm + 'systemjs/dist/system-polyfills.js',
        ]
    },
    'nipplejs': {
        libs: [
            paths.npm + 'nipplejs/dist/nipplejs.js'
        ]
    },
    'angular': {
        libs: [
            paths.npm + 'angular/angular.min.js',
            paths.npm + 'angular-deferred-bootstrap/angular-deferred-bootstrap.min.js'
        ]
    }
};

gulp.task('libs', function () {
    for (var lib in libs) {
        var libObj = libs[lib],
            dest = paths.lib + lib;

        gulp.src(libObj.libs).pipe(gulp.dest(dest));
    }
});

var tsProject = ts.createProject(path.resolve('./tsconfig.json'));
gulp.task('build:typescript', function () {
    return tsProject.src()
        //.pipe(sourcemaps.init())
        .pipe(ts(tsProject))
        .js
        //.pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: '/' }))
        .pipe(gulp.dest(function (file) { return file.base; }));
});

gulp.task('build:sass', function () {
    return gulp.src(paths.sass)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        //.pipe(cssmin())
        .pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: '/app' }))
        .pipe(gulp.dest(function (file) { return file.base; }));
});

// jasmine tests
gulp.task('jasmine', ['build:typescript'], function () {
    return gulp.src(['./**/*.spec.js', paths.ignore.npm])
        // gulp-jasmine works on filepaths so you can't have any plugins before it
        .pipe(jasmine());
});

// watch task
gulp.task('watch', function () {
    gulp.watch(paths.sass, ['build:sass']);
    gulp.watch([paths.typescript, paths.ignore.npm], ['build:typescript']);
});
// watch jasmine
gulp.task('watch:jasmine', function () {
    gulp.watch([paths.typescript, paths.ignore.npm], ['jasmine']);
});

gulp.task('build', ['build:typescript', 'build:sass']);

gulp.task('default', ['build']);
