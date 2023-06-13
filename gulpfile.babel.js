//imports
import gulp from 'gulp';
import path from 'path';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import del from "del";
import browserSync from 'browser-sync';
import uglify from 'gulp-uglify';
import htmlmin from 'gulp-htmlmin';
import sharpResponsive from "gulp-sharp-responsive";
import size from 'gulp-size';
import ttf2woff2 from 'gulp-ttf2woff2';
import fileinclude from'gulp-file-include';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import svgSprite from 'gulp-svg-sprite';
import vinylFTP from 'vinyl-ftp';
import ifPlugin from 'gulp-if';
import webpack from 'webpack-stream';
import {webpackConfig} from "./webpack.config.js";

//test
// import webpHtml from 'gulp-webp-html-nosvg'
// import groupCssMediaQueries from 'gulp-group-css-media-queries';




// variables
const IF = ifPlugin
const isBuild = process.argv.includes('--build');
const isDev = !process.argv.includes('--build');
const sass = gulpSass(dartSass);
const configFTP = {
    host: '', // address FTP
    user: '', // User name
    password: '', // Password
    parallel: 20, // Number of threads
    path: '' //to dir. at hosting
};
const projectDirName = path.basename(path.resolve());
const buildPath = `./_build`;
const srcPath = `./_src`;
const paths = {
    allFiles: {
        src: `${srcPath}/**/*.*`,
        dest: `${buildPath}/`,
    },
    static: {
        src:`${srcPath}/STATIC/**/*.*`,
        dest: `${buildPath}/STATIC/`
    },
    styles: {
        src: `${srcPath}/STYLE/**/*.{scss, css, sass}`,
        dest: `${buildPath}/STYLE/`
    },
    scripts: {
        src: `${srcPath}/JS/**/*.js`,
        dest: `${buildPath}/JS/`
    },
    documentsParts: `${srcPath}HTML_parts/**/*.html`,
    documents: {
        src: [`${srcPath}/*.html`],
        dest: `${buildPath}/`,
    },
    media: {
        src: {
            jpg: [`${srcPath}/MEDIA/**/*.jpg`, `${srcPath}/IMAGES/**/*.jpeg`],
            png: `${srcPath}/MEDIA/**/*.png`,
        },
        dest: `${buildPath}/MEDIA/`,
    },
    fonts: {
        src: `${srcPath}/STYLE/FONTS/**/*.{ttf, woff, otf}`, //maybe change
        dest: `${buildPath}/STYLE/FONTS/`
    },
    svg:{
        src: `${srcPath}/MEDIA/SVG/**/*.svg`,
        dest: `${buildPath}/MEDIA/SVG/`
    },
    jason:{
        src:`${srcPath}/JS/JSON/**/*.json`,
        dest:`${buildPath}/JS/JSON/`
    }
};

const handleError = (taskName) => {
    return plumber({
        errorHandler: notify.onError({
            title: taskName,
            message: 'Error: <%= error.message %>',
        }),
    });
};

const ftp = () => {
    const ftpConnect = vinylFTP.create(configFTP);
    return gulp.src(paths.allFiles.dest)
        .pipe(handleError('FTP'))
        .pipe(ftpConnect.dest(`${configFTP.path}/${projectDirName}`));
};


//ToDo: turn all func to arrow ()=>{}

function serverFunc() {
    browserSync.init({
        server: {
            baseDir: paths.allFiles.dest,
            index: "index.html",
            port: 3000
        },
        ui: {
            port: 8080,
            weinre: {
                //ToDo: test weinre
                port: 9090
            }
        },
    });
}

const createSvgSprite = () => {
    return gulp.src(paths.svg.src)
        .pipe(handleError('SVG'))
        .pipe(svgSprite({
                mode: {
                    stack: {
                        sprite: `icons.svg`,
                        example: true,
                    },
                },
            })
        )
        .pipe(gulp.dest(paths.svg.dest));
};

function staticFunc() {
    return gulp.src(paths.static.src)
        .pipe(handleError('STATIC'))
    .pipe(gulp.dest(paths.static.dest))
}


function JsonFunc() {
    return gulp.src(paths.jason.src)
        .pipe(handleError('JSON'))
        .pipe(gulp.dest(paths.jason.dest))}

function deleteFunc() {
    return del(paths.allFiles.dest)
}

function fontFunc() {
    return gulp.src(paths.fonts.src)
        .pipe(handleError('FONT'))
        .pipe(ttf2woff2())
        .pipe(size())
        .pipe(gulp.dest(paths.fonts.dest))
        .pipe(browserSync.stream());
}

function ScriptFunc() {
    return gulp.src(paths.scripts.src)
        .pipe(handleError('SCRIPTS'))
        .pipe(IF(isDev, sourcemaps.init({
            largeFile: true,
        })))
        .pipe(webpack({ config: webpackConfig(isDev) }))
        .pipe(babel())
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(size())
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream());
}

function StyleFunc() {
    return gulp.src(paths.styles.src)
        .pipe(handleError('STYLE'))
        .pipe(IF(isDev, sourcemaps.init({
            largeFile: true,
        })))
        .pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
        // .pipe(IF(isBuild, groupCssMediaQueries()))
        .pipe(autoprefixer({
            cascade: true
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(size())
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream());
}

function jpgFunc() {
    return gulp.src(paths.media.src.jpg)
        .pipe(handleError('JPG'))
        .pipe(sharpResponsive({
            includeOriginalFile: true,
            formats: [
                { format: "webp", quality: 75},
                { format: "avif"},
            ]
        }))
        .pipe(size())
        .pipe(gulp.dest(paths.media.dest))
        .pipe(browserSync.stream());
}

function pngFunc() {
    return gulp.src(paths.media.src.png)
        .pipe(handleError('PNG'))
        .pipe(sharpResponsive({
            includeOriginalFile: true,
            formats: [
                { format: "webp", quality: 80},
            ]
        }))
        .pipe(size())
        .pipe(gulp.dest(paths.media.dest))
        .pipe(browserSync.stream());
}



function HTMLFunc() {
    return gulp.src(paths.documents.src)
        .pipe(handleError('HTML'))
        .pipe(IF(isDev, sourcemaps.init({
            largeFile: true,
        })))
        .pipe(fileinclude({
            prefix: '@@',
            /**basepath: '@file'**/
        }))
        // .pipe(IF(isBuild, webpHtml()))
        // .pipe(webpHtml())
        .pipe(htmlmin({
            useShortDoctype: true,
            sortClassName: true,
            collapseWhitespace: isBuild,
            removeComments: isBuild
        }))
        .pipe(size())
        .pipe(gulp.dest(paths.documents.dest))
        .pipe(browserSync.stream());
}

function watchFunc() {
    gulp.watch(paths.scripts.src, ScriptFunc);
    gulp.watch(paths.styles.src, StyleFunc);
    gulp.watch(paths.media.src.jpg, jpgFunc);
    gulp.watch(paths.media.src.png, pngFunc);
    gulp.watch(paths.documents.src, HTMLFunc);
    gulp.watch(paths.svg.src, createSvgSprite);
    gulp.watch(paths.jason.src, JsonFunc);
    gulp.watch(paths.documentsParts, HTMLFunc);
    gulp.watch(paths.static.src, staticFunc);
}


//tasks

const media_task = gulp.parallel(jpgFunc, pngFunc, createSvgSprite);
const server_task = gulp.parallel(serverFunc, watchFunc);
const clean_task = deleteFunc; // add ()
const static_task = gulp.parallel(staticFunc, JsonFunc)
const transpile_task = gulp.parallel(HTMLFunc, fontFunc, ScriptFunc, StyleFunc)

const development = gulp.series(clean_task, static_task, media_task, transpile_task, server_task);
const build = gulp.series(clean_task, static_task, media_task, transpile_task);

gulp.task('clean', deleteFunc)
gulp.task('media', media_task)
gulp.task('static', static_task)
gulp.task('default', development)
gulp.task('dev', development)
gulp.task('build', build)
gulp.task('ftp', ftp)

export {paths};