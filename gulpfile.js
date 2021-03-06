const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

const cssFiles = [
    './node_modules/normalize.css/normalize.css',
    './src/scss/style.scss',
    './src/scss/media.scss'
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

function img(){
    return gulp.src('./src/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./build/img'))
}


function watch(){
    browserSync.init({
        server: {
            baseDir: "./"
        },
       // tunnel: true
       browser: "chrome",
       notify: false
    });

    gulp.watch('./src/scss/**/*.scss', styles);
    gulp.watch('./src/js/**/*.js', scripts);
    gulp.watch('./*.html', browserSync.reload);

}

function clean (){
   return del (['build/*']);
}

gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('img', img);
gulp.task('watch', watch)

gulp.task('build', gulp.series(clean,
                    gulp.parallel(styles, scripts, img)));

gulp.task('dev', gulp.series('build', 'watch'));