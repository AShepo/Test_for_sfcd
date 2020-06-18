const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();

const cssFiles = [
    './node_modules/normalize.css/normalize.css',
    './src/css/style.css',
    './src/css/style.scss'
]

const jsFiles = [
    './src/js/main.js'
]

function styles(){
    return gulp.src(cssFiles)
        .pipe(concat('all.css'))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['> 0.1%'],
            cascade: false
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream());
}


function scripts(){
    return gulp.src(jsFiles)
        .pipe(concat('main.js'))
        .pipe(uglify({
            toplevel: true
        }))
        .pipe(gulp.dest('./build/js'))
        .pipe(browserSync.stream());
}


function watch(){
    browserSync.init({
        server: {
            baseDir: "./"
        }
       // tunnel: true
    });

    gulp.watch('./src/css/**/*.scss', styles);
    gulp.watch('./src/js/**/*.js', scripts);
    gulp.watch('./*.html', browserSync.reload);

}

function clean (){
   return del (['build/*']);
}

gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('watch', watch);

gulp.task('build', gulp.series(clean, 
                    gulp.parallel(styles, scripts)));

gulp.task('dev', gulp.series('build', 'watch'));