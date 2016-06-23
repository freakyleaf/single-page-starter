var browsersync  = require('browser-sync').create();
var del          = require('del');
var gulp         = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var copy         = require('gulp-contrib-copy');
var cssnano      = require('gulp-cssnano');
var livereload   = require('gulp-livereload');
var modernizr    = require('gulp-modernizr');
var mustache     = require("gulp-mustache");
var plumber      = require('gulp-plumber');
var rename       = require('gulp-rename');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var uglify       = require('gulp-uglify');
var gutil        = require('gulp-util');
var watch        = require('gulp-watch');
var merge        = require('merge-stream');

var paths        = require('./manifest.json'); // PROJECT CONFIG FILE

// CLEAN TASKS

gulp.task('clean', function () {
	return del('build/**/*');
});

// CSS TASKS

gulp.task('css', function() {

	return gulp.src(paths.src.scss)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer('last 4 versions'))
	.pipe(rename('style.css'))
	.pipe(cssnano())
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest(paths.dest.css))
	.pipe(browsersync.stream());

});

// JS TASKS

gulp.task('js', function() {

	return gulp.src(paths.src.js)
	.pipe(copy())
	.pipe(gulp.dest(paths.dest.js))
	.pipe(browsersync.stream());

});

// MODERNIZR TASKS

gulp.task('modernizr', ['css', 'js', 'mustache'], function() {
	return gulp.src(paths.dest.css + 'style.css')
	.pipe(modernizr(paths.settings.modernizr))
	.pipe(uglify())
	.pipe(gulp.dest(paths.dest.js));
});

// MUSTACHE TASKS

gulp.task('mustache', function() {

	return gulp.src(paths.src.mustache)
	.pipe(mustache(paths.src.json))
	.pipe(rename({ extname: ".html" }))
	.pipe(gulp.dest(paths.dest.html))
	.pipe(browsersync.stream());

});

// SERVER TASKS

gulp.task('server', function() {
	browsersync.init({
		server: {
			baseDir: "./build/"
		},
		notify: {
			styles: [
			'display: none',
			'z-index: 9999',
			'position: fixed',
			'bottom: 0',
			'right: 0',
			'font-family: sans-serif',
			'font-size: 16px',
			'text-align: center',
			'color: white',
			'margin: 0',
			'padding: 15px',
			'background-color: #2A2A2A'
			]
		}
	});
});

// DEFAULT TASK

gulp.task('default', ['clean', 'watch']);

// WATCH TASK

gulp.task('watch', ['css', 'js', 'mustache', 'server'], function() {
	livereload.listen();
	gulp.watch(paths.watch.css, ['css']);
	gulp.watch(paths.watch.mustache, ['mustache']);
	gulp.watch(paths.watch.js, ['js']);
	gulp.watch(paths.watch.json, ['mustache']);
    browsersync.reload();
});