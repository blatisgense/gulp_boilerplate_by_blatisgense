//==============
// IMPORTS
//==============
import gulp from 'gulp';
import path from 'path';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import del from "del";
import browserSync from 'browser-sync';
import htmlmin from 'gulp-htmlmin';
import sharpResponsive from "gulp-sharp-responsive";
import size from 'gulp-size';
import fileinclude from'gulp-file-include';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import svgSprite from 'gulp-svg-sprite';
import vinylFTP from 'vinyl-ftp';
import ifPlugin from 'gulp-if';
import groupCssMediaQueries from 'gulp-group-css-media-queries';
import fs from 'fs';
import ttf2woff2 from 'gulp-ttf2woff2';
import fonter from './node_modules/gulp-fonter-2/dist/index.js' //self-made fix, that asshole create index.d.ts empty...

import webpack from 'webpack-stream';
import { webpackConfig } from './webpack.config.js';

//test
// import webpHtml from 'gulp-webp-html-nosvg'; // write plugin for yourself



//==============
// VARIABLES
//==============
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
        font: `${srcPath}/STYLE/`,
        src: `${srcPath}/STYLE/**/*.{scss, css, sass}`,
        dest: `${buildPath}/STYLE/`
    },
    scripts: {
        src: `${srcPath}/JS/**/*.js`,
        dest: `${buildPath}/JS/`
    },
    documentsParts: `${srcPath}/HTML_parts/**/*.html`,
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
        src: {
            dest: `${srcPath}/STYLE/FONTS_SRC/`,
            woff2:`${srcPath}/STYLE/FONTS/`,
            src:`${srcPath}/STYLE/FONTS/*.woff2`,
            ttf: `${srcPath}/STYLE/FONTS_SRC/*.ttf`,
            otf: `${srcPath}/STYLE/FONTS_SRC/*.otf`
        },
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


//==============
// FUNCTIONS
//==============
const ftp = () => {
    const ftpConnect = vinylFTP.create(configFTP);
    return gulp.src(paths.allFiles.dest)
        .pipe(handleError('FTP'))
        .pipe(ftpConnect.dest(`${configFTP.path}/${projectDirName}`));
};
const serverFunc = () => {
    browserSync.init({
        server: {
            baseDir: paths.allFiles.dest,
            index: "index.html",
            port: 3000
        },
        ui: {
            port: 8080,
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
const staticFunc = () => {
    return gulp.src(paths.static.src)
        .pipe(handleError('STATIC'))
    .pipe(gulp.dest(paths.static.dest))
}
const JsonFunc = () => {
    return gulp.src(paths.jason.src)
        .pipe(handleError('JSON'))
        .pipe(gulp.dest(paths.jason.dest))}
const deleteFunc = () => {
    return del(paths.allFiles.dest)
}
const ScriptFunc = () => {
    return gulp.src(paths.scripts.src)
        .pipe(handleError('SCRIPTS'))
        .pipe(IF(isDev, sourcemaps.init({
            largeFile: true,
        })))
        .pipe(webpack({ config: webpackConfig(isDev)}))
        .pipe(sourcemaps.write('./'))
        .pipe(size())
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream());
}
const StyleFunc = () => {
    return gulp.src(paths.styles.src)
        .pipe(handleError('STYLE'))
        .pipe(IF(isDev, sourcemaps.init({
            largeFile: true,
        })))
        .pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(IF(isBuild, autoprefixer({cascade: true})))
        .pipe(IF(isBuild, groupCssMediaQueries()))
        .pipe(sourcemaps.write('./'))
        .pipe(size())
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream());
}
const jpgFunc = () => {
    return gulp.src(paths.media.src.jpg)
        .pipe(handleError('JPG'))
        .pipe(sharpResponsive({
            formats: [
                { format: "webp", quality: 75},
                { format: "avif"},
            ]
        }))
        .pipe(size())
        .pipe(gulp.dest(paths.media.dest))
        .pipe(browserSync.stream());
}
const pngFunc = () => {
    return gulp.src(paths.media.src.png)
        .pipe(handleError('PNG'))
        .pipe(sharpResponsive({
            formats: [
                { format: "webp", quality: 75},
            ]
        }))
        .pipe(size())
        .pipe(gulp.dest(paths.media.dest))
        .pipe(browserSync.stream());
}
const mode = async () => {
    if (isDev){
        console.log(`mode is dev`)
    } else {
        console.log(`mode is build`)
    }
}
const HTMLFunc = () => {
    return gulp.src(paths.documents.src)
        .pipe(handleError('HTML'))
        .pipe(IF(isDev, sourcemaps.init({
            largeFile: true,
        })))
        .pipe(fileinclude({
            prefix: '@@',
            /**basepath: '@file'**/
        }))
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


//==============
// FONTS
//==============
const font_ttf = () => {
    return (gulp.src(paths.fonts.src.otf)
            .pipe(handleError('OTF_TO_TTF'))
            .pipe(fonter(
                { formats: ['ttf'] }
            ))
            .pipe(size())
            .pipe(gulp.dest(paths.fonts.src.dest))
    )};

const font_woff2 = () => {
    return (gulp.src(paths.fonts.src.ttf))
        .pipe(handleError('TTF_TO_WOFF2'))
        .pipe(ttf2woff2())
        .pipe(size())
        .pipe(gulp.dest(paths.fonts.src.woff2))
}


const font_face = async () => {
    const fonts_sass = `${paths.styles.font}fonts.scss`;
    fs.readdir(paths.fonts.src.woff2, (err, fonts) => {
        if (fonts) {
            fs.writeFile(fonts_sass, '', error_log);
            fonts.forEach((file) => {
                const font_library = {
                    thin: {
                        weight: 100,
                        style: "normal",
                    },
                    thinitalic: {
                        weight: 100,
                        style: "italic",
                    },


                    extralight: {
                        weight: 200,
                        style: "normal",
                    },
                    extralightitalic: {
                        weight: 200,
                        style: "italic",
                    },


                    light: {
                        weight: 300,
                        style: "normal",
                    },
                    lightitalic: {
                        weight: 300,
                        style: "italic",
                    },


                    regular: {
                        weight: 400,
                        style: "normal",
                    },
                    regularitalic: {
                        weight: 400,
                        style: "italic",
                    },


                    italic:{
                        weight: 400,
                        style: "italic",
                    },


                    medium: {
                        weight: 500,
                        style: "normal",
                    },
                    mediumitalic: {
                        weight: 500,
                        style: "italic",
                    },


                    semibold: {
                        weight: 600,
                        style: "normal",
                    },
                    semibolditalic: {
                        weight: 600,
                        style: "italic",
                    },


                    bold: {
                        weight: 700,
                        style: "normal",
                    },
                    bolditalic: {
                        weight: 700,
                        style: "italic",
                    },


                    extrabold: {
                        weight: 800,
                        style: "normal",
                    },
                    extrabolditalic: {
                        weight: 800,
                        style: "italic",
                    },


                    heavy: {
                        weight: 800,
                        style: "normal",
                    },
                    heavyitalic: {
                        weight: 800,
                        style: "italic",
                    },


                    black: {
                        weight: 900,
                        style: "normal",
                    },
                    blackitalic: {
                        weight: 900,
                        style: "italic",
                    }
                }; //config for fonts

                const fontName = file.split('.')[0];
                const font_data = fontName.split('-')[1].toLowerCase();
                const fontWeight = font_library[font_data].weight;
                const fontStyle = font_library[font_data].style;

                fs.appendFile(fonts_sass,
                    `@font-face {\n\tfont-family: ${fontName}; \n\tfont-display: swap; \n\tsrc: url("./FONTS/${fontName}.woff2") format("woff2"); \n\tfont-weight: ${fontWeight};\n\tfont-style: ${fontStyle};\n}\n\n`, error_log);
            });
            function error_log(err) {
                if (err) {
                    console.log(`Error in write file: ${fonts_sass}`, err);
            } else {
                console.log(`Font successfully added to file ${fonts_sass}`);
            }}
        }
    })


    return gulp.src(paths.fonts.src.src)
        .pipe(handleError('FONT_copy'))
        .pipe(size())
        .pipe(gulp.dest(paths.fonts.dest))
}







const watchFunc = () => {
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


//==============
// TASKS
//==============
const media_task = gulp.parallel(jpgFunc, pngFunc, createSvgSprite);
const font_task = gulp.series(font_ttf, font_woff2, font_face);
const server_task = gulp.parallel(serverFunc, watchFunc);
const clean_task = deleteFunc;
const static_task = gulp.parallel(staticFunc, JsonFunc);
const transpile_task = gulp.parallel(HTMLFunc, ScriptFunc, StyleFunc);



const development = gulp.series(mode, clean_task, static_task, font_task, media_task, transpile_task, server_task);
const build = gulp.series(mode, clean_task, static_task, font_task, media_task, transpile_task);

gulp.task('clean', deleteFunc);
gulp.task('media', media_task);
gulp.task('static', static_task);
gulp.task('default', development);
gulp.task('dev', development);
gulp.task('build', build);
gulp.task('ftp', ftp);
gulp.task('font', font_task);


export {paths};