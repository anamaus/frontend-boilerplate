(function() {
    "use strict";
    var gulp = require('gulp');
    var bourbon = require("bourbon").includePaths;
    var sass = require('gulp-sass');
    var eslint = require('gulp-eslint');
    var browserSync = require('browser-sync').create();
    var useref = require('gulp-useref');
    var uglify = require('gulp-uglify');
    var gulpIf = require('gulp-if');
    var cssnano = require('gulp-cssnano');
    var imagemin = require('gulp-imagemin');
    var cache = require('gulp-cache');
    var del = require('del');
    var runSequence = require('run-sequence');
    var imageminJpegRecompress = require('imagemin-jpeg-recompress');
    var autoprefixer = require('gulp-autoprefixer');
    var responsive = require('gulp-responsive-images');
    var scsslint = require('gulp-scss-lint');


    gulp.task('sass', function(){
        return gulp.src('app/scss/**/*.scss')
            .pipe(sass()) // Converts Sass to CSS with gulp-sass
            .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }))
            .pipe(gulp.dest('app/css'))
            .pipe(browserSync.reload({
                stream: true
            }));
    });

    gulp.task('watch', ['browserSync', 'sass'],function(){
        gulp.watch('app/scss/**/*.scss', ['sass']);
        // Other watchers
        gulp.watch('app/*.html', browserSync.reload);
        gulp.watch('app/js/**/*.js', browserSync.reload);
    });

    gulp.task('browserSync', function() {
        browserSync.init({
            server: {
                baseDir: 'app'
            }
        })
    });


//minify js or css
    gulp.task('useref', function(){
        return gulp.src('app/*.html')
            .pipe(useref())
            .pipe(gulpIf('*.js', uglify()))
            .pipe(gulpIf('*.css', cssnano()))
            .pipe(gulp.dest('dist'));
    });



    gulp.task('scsslint', function() {
        return gulp.src(['app/scss/**/*.scss', '!app/scss/vendor/**/*.scss'])
            .pipe(scsslint({
                'config': '.scss-lint.yml'
            }));
    });


//font transfer to dist
    gulp.task('fonts', function() {
        return gulp.src('app/fonts/**/*')
            .pipe(gulp.dest('dist/fonts'));
    });

//cleaning up generated files
    gulp.task('clean:dist', function() {
        return del.sync('dist');
    });

//build task 1 and then task/tasks 2, then task3
    gulp.task('build', function (callback) {
        runSequence('clean:dist',
            ['lint',  'sass', 'useref', 'images', 'fonts'],
            callback
        );
    });

// build task for 1st set... calls it by typing only gulp in cmd
    gulp.task('default', function (callback) {
        runSequence(['sass','scsslint','browserSync', 'watch'],
            callback
        );
    });

//optimizing images
    gulp.task('images', function () {
        return gulp.src('app/images/**/*.+(png|jpg|gif|svg|ico)')
            .pipe(cache(imageminJpegRecompress({loops: 3})()))
            .pipe(gulp.dest('dist/images'));
    });

//IMAGE RESIZING
    gulp.task('resize', function () {
        gulp.src('app/images/**/*')
            .pipe(responsive({
                '*': [{
                    width:500,
                    suffix: '-500'
                }, {
                    width: 300 ,
                    suffix: '-300'
                }]
                // ,
                // '*.jpg': [{
                //     width: 600,
                //     crop: true
                // }]
            }))
            .pipe(gulp.dest('app/images/resized'));
    });

    gulp.task('lint', function() {
        // ESLint ignores files with "node_modules" paths.
        // So, it's best to have gulp ignore the directory as well.
        // Also, Be sure to return the stream from the task;
        // Otherwise, the task may end before the stream has finished.
        return gulp.src(['app/js/**/*.js','!node_modules/**'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
            .pipe(eslint())
            // eslint.format() outputs the lint results to the console.
            // Alternatively use eslint.formatEach() (see Docs).
            .pipe(eslint.format())
            // To have the process exit with an error code (1) on
            // lint error, return the stream and pipe to failAfterError last.
            .pipe(eslint.failAfterError());
    });


}());


