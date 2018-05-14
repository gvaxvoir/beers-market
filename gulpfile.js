'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var gulpImports = require('gulp-imports');

gulp.task('styles', function () {
    gulp.src('./sass/styles.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./css'));

    gulp.start('css');
});

//script paths
var jsFiles = 'js/scripts.js',
    jsDest = 'dist/';

gulp.task('scripts', function() {
    return gulp.src(jsFiles)
        .pipe(gulpImports())
        .pipe(gulp.dest(jsDest));
});

//styles paths
var cssFiles = 'css/**/*.css',
    cssDest = 'dist/';

gulp.task('css', function() {
    return gulp.src(cssFiles)
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(cssDest));
});

gulp.task('watch', function () {
    gulp.watch('./sass/**/*.scss', ['styles']);
    gulp.watch('./js/**/*.js', ['scripts']);
});

gulp.task('default', function() {
    gulp.start('styles', 'scripts');
});