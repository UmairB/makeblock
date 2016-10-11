"use strict";

const gulp = require('gulp'),
    path = require('path'),
    ts = require('gulp-typescript'),
    gulp_tslint = require('gulp-tslint'),
    tslint = require('tslint'),
    sass = require("gulp-sass"),
    sourcemaps = require('gulp-sourcemaps'),
    jasmine = require('gulp-jasmine'),
    notify = require('gulp-notify');

var paths = {
    webroot: "./wwwroot/",
    npm: './node_modules/',
    gulp: path.join(__dirname, 'gulp/')
};

paths.lib = paths.webroot + 'lib/';
paths.app = paths.webroot + "app/";
paths.sass = paths.app + "**/*.scss";
paths.typescript = "./**/*.ts";
paths.tsConfig = path.resolve('./tsconfig.json');
paths.resource = {
    typescript: paths.gulp + 'resource/ts.png',
    sass: paths.gulp + 'resource/sass.png'
};
paths.ignore = {
    npm: '!' + paths.npm + '/**'
};

const libs = {
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
            paths.npm + 'angular-route/angular-route.min.js',
            paths.npm + 'angular-deferred-bootstrap/angular-deferred-bootstrap.min.js'
        ]
    }
};

let tsLint = function (files, emitError) {
    var files = Array.isArray(files) ? files : [files];
    return gulp.src(files)
        .pipe(gulp_tslint({
            formatter: "verbose"
        }))
        .pipe(gulp_tslint.report({
            emitError: !!emitError
        }));
};

gulp.task('libs', function () {
    for (var lib in libs) {
        var libObj = libs[lib],
            dest = paths.lib + lib;

        gulp.src(libObj.libs).pipe(gulp.dest(dest));
    }
});

const tsProject = ts.createProject(paths.tsConfig);
gulp.task('build:typescript', function () {
    return tsProject.src()
        //.pipe(sourcemaps.init())
        .pipe(tsProject())
        .on('error', notify.onError({
            onLast: true,
            title: 'TypeScript',
            message: 'Typescript compilation failed',
            icon: paths.resource.typescript
        }))
        .js
        //.pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: '/' }))
        .pipe(gulp.dest(function (file) { return file.base; }))
        .pipe(notify({
            onLast: true,
            title: 'TypeScript',
            message: 'Typescript compilation completed',
            icon: paths.resource.typescript
        }));
});

gulp.task('build:sass', function () {
    return gulp.src(paths.sass)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        //.pipe(cssmin())
        .pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: '/app' }))
        .pipe(gulp.dest(function (file) { return file.base; }));
});

const program = tslint.createProgram(paths.tsConfig);
const files = program.getRootFileNames();
gulp.task('tslint', function () { return tsLint(files, true); });

// jasmine tests
gulp.task('jasmine', function () {
    return gulp.src(['./**/*.spec.js', paths.ignore.npm])
        // gulp-jasmine works on filepaths so you can't have any plugins before it
        .pipe(jasmine());
});

// watch task
gulp.task('watch', ['watch:sass', 'watch:typescript']);
gulp.task('watch:sass', function () {
    return gulp.watch(paths.sass, ['build:sass']);
});
gulp.task('watch:typescript', ['build:typescript'], function () {
    return gulp.watch([paths.typescript, paths.ignore.npm], ['build:typescript'])
        .on('change', (file) => {
            tsLint(file.path);
        });
});
// watch jasmine
gulp.task('watch:jasmine', function () {
    gulp.watch([paths.typescript, paths.ignore.npm], ['jasmine']);
});

gulp.task('build', ['build:typescript', 'build:sass']);
gulp.task('production', ['libs', 'build']);
gulp.task('default', ['build']);
