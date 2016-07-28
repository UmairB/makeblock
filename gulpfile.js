"use strict";

var gulp = require('gulp'),
    path = require('path'),
    ts = require('gulp-typescript'),
    sass = require("gulp-sass"),
    sourcemaps = require('gulp-sourcemaps');

var paths = {
    webroot: "./wwwroot/",
    npm: './node_modules/'
};

paths.lib = paths.webroot + 'lib/';
paths.app = paths.webroot + "app/";
paths.sass = paths.app + "**/*.scss";
paths.typescript = "./**/*.ts";

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
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject))
        .js
        .pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: '/' }))
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

// watch task
gulp.task('watch', function () {
    gulp.watch(paths.sass, ['build:sass']);
    gulp.watch(paths.typescript, ['build:typescript']);
});

gulp.task('build', ['build:typescript', 'build:sass']);
gulp.task('default', ['build']);
