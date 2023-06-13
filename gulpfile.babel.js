//imports
import gulp from 'gulp';
import path from 'path';
import dartSass from 'sass';
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

//test
import webpHtml from 'gulp-webp-html-nosvg'
import zipPlugin from 'gulp-zip';

import {plugins} from "./q/gulp/config/plugins.js";
import groupCssMediaQueries from 'gulp-group-css-media-queries';
//find usages


// variables
const IF = ifPlugin
    //ToDo check IF and plugin. references
const isBuild = process.argv.includes('--build');
const isDev = !process.argv.includes('--build');
const sass = gulpSass(dartSass);
const configFTP = {
    host: '', // adress FTP
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
    ftp: ``,
    //ToDo: path to variables, add media folder instead IMAGES SVG etc.
    static: {
        src:`${srcPath}/static/**/*.*`,
        dest: `${buildPath}/static/`
    },
    styles: {
        src: '_src/SCSS/**/*.{scss, css, sass}',
        dest: '_build/CSS/'
    },
    scripts: {
        src: '_src/SCRIPTS/**/*.js',
        dest: '_build/SCRIPTS/'
    },
    documentsParts: "_src/HTML_parts/**/*.html",
    documents: {
        src: ['_src/*.html'],
        dest: '_build/',
    },
    imgs: {
        src: {
            jpg: ['_src/IMAGES/**/*.jpg', '_src/IMAGES/**/*.jpeg'],
            png: '_src/IMAGES/**/*.png',
        },
        dest: '_build/IMAGES/',
    },
    fonts: {
        src: '_src/SCSS/FONTS/**/*.ttf',
        dest: '_build/SCSS/FONTS/'
    },
    svg:{
        src: '_src/IMAGES/SVG/**/*.svg',
        dest: '_build/IMAGES/SVG/'
    },
    jason:{
        src:'_src/SCRIPTS/DB/**/*.json',
        dest:'_build/SCRIPTS/DB/'
    },
    zip: [`${projectDirName}/**/*.*`, ![`${projectDirName}/.gitignore`,`${projectDirName}/LICENSE`, `${projectDirName}/README.md`, `${projectDirName}/package-lock.json`, `${projectDirName}/.gitattributes`, `${projectDirName}/node_modules`, `${projectDirName}/.idea`, `${projectDirName}/components`]]
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
    return gulp.src(paths.allFiles.src)
        .pipe(plugins.handleError('FTP'))
        .pipe(ftpConnect.dest(`${paths.ftp}/${projectDirName}`));
};

const zip = () => {
    del(`${projectDirName}/${projectDirName}.zip`);
    return gulp.src(paths.zip)
        .pipe(handleError('ZIP'))
        .pipe(zipPlugin(`${projectDirName}/${projectDirName}.zip`))
        .pipe(gulp.dest(`${projectDirName}/`));
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

function copyFunc() {
    return gulp.src(paths.static.src)
    .pipe(gulp.dest(paths.static.dest))
}


function JsonFunc() {
    return gulp.src(paths.jason.src)
        .pipe(gulp.dest(paths.jason.dest))}

function deleteFunc() {
    return del(paths.allFiles.dest)
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
        .pipe(babel())
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(size())
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream());
}

function StyleFunc() {
    // todo add sourse maps like this
    return gulp.src(paths.styles.src)
        .pipe(IF(isDev, sourcemaps.init({
            largeFile: true,
        })))
        .pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(IF(isBuild, groupCssMediaQueries()))
        .pipe(autoprefixer({
            cascade: true
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(size())
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream());
}

function jpgFunc() {
    return gulp.src(paths.imgs.src.jpg)
        .pipe(handleError('JPG'))
        .pipe(sharpResponsive({
            includeOriginalFile: true,
            formats: [
                { format: "webp", quality: 75},
                { format: "avif"},
            ]
        }))
        .pipe(size())
        .pipe(gulp.dest(paths.imgs.dest))
        .pipe(browserSync.stream());
}

function pngFunc() {
    return gulp.src(paths.imgs.src.png)
        .pipe(handleError('PNG'))
        .pipe(sharpResponsive({
            includeOriginalFile: true,
            formats: [
                { format: "webp", quality: 80},
            ]
        }))
        .pipe(size())
        .pipe(gulp.dest(paths.imgs.dest))
        .pipe(browserSync.stream());
}



function HTMLFunc() {
    return gulp.src(paths.documents.src)
        .pipe(handleError('HTML'))
        .pipe(fileinclude({
            prefix: '@@',
            /**basepath: '@file'**/
        }))
        .pipe(IF(isBuild, webpHtml()))
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
    gulp.watch(paths.imgs.src.jpg, jpgFunc);
    gulp.watch(paths.imgs.src.png, pngFunc);
    gulp.watch(paths.documents.src, HTMLFunc);
    gulp.watch(paths.svg.src, svgFunc);
    gulp.watch(paths.jason.src, JsonFunc);
    gulp.watch(paths.documentsParts, HTMLFunc);
}




const defaultTask = gulp.series(deleteFunc,  gulp.parallel(svgFunc, JsonFunc,  HTMLFunc ,fontFunc, ScriptFunc, StyleFunc, gulp.parallel(jpgFunc, pngFunc,), ), gulp.parallel(serverFunc, watchFunc,),);

gulp.task('delete', deleteFunc)
gulp.task('img', jpgFunc)
gulp.task('default', defaultTask)