var gulp = require('gulp');
var ts = require('gulp-typescript');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');

var tsProject = ts.createProject(path.resolve('./tsconfig.json'));
gulp.task('build:server', function () {
    return tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject))
        .js
        .pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: '/' }))
        .pipe(gulp.dest(function (file) { return file.base; }));
});

gulp.task('build', ['build:server']);
gulp.task('default', ['build']);
