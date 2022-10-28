//imports
import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';
//import concat from 'gulp-concat'; at now useless
import autoprefixer from 'gulp-autoprefixer';
import del from "del";
import browserSync from 'browser-sync';
import cleanCSS from 'gulp-clean-css';
import uglify from 'gulp-uglify';
import htmlmin from 'gulp-htmlmin';
import sharpResponsive from "gulp-sharp-responsive";
import rename from "gulp-rename";
import size from 'gulp-size';
import ttf2woff2 from 'gulp-ttf2woff2';
import zip from 'gulp-zip';
import fileinclude from'gulp-file-include';



// consts
const sass = gulpSass(dartSass);

const paths = {
    allFiles: {
        src: '_src/**/*.*',
        dest: '_build/',
        destZIP: '_build/**/*.*',
    },
    styles: {
        src: '_src/SCSS/**/*.{scss, css, sass}',
        dest: '_build/SCSS/'
    },
    scripts: {
        src: '_src/SCRIPTS/**/*.js',
        dest: '_build/SCRIPTS/'
    },
    documents: {
        //for one page site =>
        //src: '_src/*.html',
        src: ['_src/*.html' , '!_src/index.html'],
        dest: '_build/',
    },
    imgs: {
        //_src: '_src/IMAGES/**/*.{png, jpg, jpeg}', hui znaet pochemu ne robit, ya nakalhozil =>
        src: ['_src/IMAGES/**/*.jpg', '_src/IMAGES/**/*.jpeg', '_src/IMAGES/**/*.png'],
        dest: '_build/IMAGES/',
    },
    fonts: {
        src: '_src/SCSS/FONTS/**/*.ttf',
        dest: '_build/SCSS/FONTS/'
    },
    root: '/',
};


//tasks
function serverFunc() {
    browserSync.init({
        server: {
            baseDir: paths.allFiles.dest,
            index: "index.html",
        },
        ui: {
            port: 8080,
        },
    });
}

function copyFunc() {
    return gulp.src(paths.allFiles.src).pipe(gulp.dest(paths.allFiles.dest))
}

function deleteFunc() {
    return del([paths.allFiles.dest])
}

function fontFunc() {
    return gulp.src(paths.fonts.src)
        .pipe(ttf2woff2())
        .pipe(size())
        .pipe(gulp.dest(paths.fonts.dest))
        .pipe(browserSync.stream());
}

function ScriptFunc() {
    return gulp.src(paths.scripts.src)
        .pipe(sourcemaps.init({largeFile: true}))
        .pipe(babel({
            plugins: ['@babel/transform-runtime'],
            presets: ['@babel/env']
        }))
        /**.pipe(concat('app.js')) at now so useless**/
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min",
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(size())
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream());
}

function StyleFunc() {
    return gulp.src(paths.styles.src)
        .pipe(sourcemaps.init({largeFile: true}))
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(autoprefixer({
            cascade: true
        }))
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: ".min",
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(size())
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream());
}

function jpgFunc() {
    return gulp.src(paths.imgs.src)
        .pipe(sharpResponsive({
            /** includeOriginalFile: true,  if need to use original file **/
            formats: [
                { format: "webp", quality: 70},
                // avif now? { format: "avif", width: 1920, rename: { suffix: "-xl" }},
            ]
        }))
        .pipe(size())
        .pipe(gulp.dest(paths.imgs.dest))
        .pipe(browserSync.stream());
}

function HTMLFunc() {
    return gulp.src(paths.documents.src)
        //.pipe(avifWebpHTML())
        .pipe(fileinclude({
            prefix: '@@',
            /**basepath: '@file'**/
        }))
        .pipe(htmlmin({ collapseWhitespace: true }))
        //only for multiPage sites =>
        .pipe(rename({
            suffix: ".min",
        }))
        .pipe(size())
        .pipe(gulp.dest(paths.documents.dest))
        .pipe(browserSync.stream());
}

function watchFunc() {
    gulp.watch(paths.scripts.src, ScriptFunc);
    gulp.watch(paths.styles.src, StyleFunc);
    gulp.watch(paths.imgs.src, jpgFunc);
    gulp.watch(paths.documents.src, HTMLFunc);
}

function zipFunc() {
    return gulp.src(paths.allFiles.destZIP)
        .pipe(zip('ready.zip'))
        .pipe(gulp.dest(paths.allFiles.dest))
}


const defaultTask = gulp.series(deleteFunc, copyFunc, gulp.parallel(HTMLFunc ,fontFunc, ScriptFunc, StyleFunc, jpgFunc, ), gulp.parallel(serverFunc, watchFunc,));

gulp.task('delete', deleteFunc)
gulp.task('img', jpgFunc)
gulp.task('default', defaultTask)
gulp.task('createZIP', zipFunc)