import gulp from "gulp";
import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import groupCssMediaQueries from "gulp-group-css-media-queries";
import { paths } from "../_helpers/paths.js";
import browserSync from "browser-sync";
import sourcemaps from "gulp-sourcemaps";
import size from "gulp-size";
import { IF, isBuild } from "../_helpers/if.js";
import { handleError } from "../_helpers/handle_error.js";

const sass = gulpSass(dartSass);

export const taskStyle = () => {
    return gulp.src(paths.style.src)
        .pipe(handleError("STYLE"))
        .pipe(IF(!(isBuild), sourcemaps.init({
            largeFile: true,
        })))
        .pipe(IF(isBuild, autoprefixer({cascade: true})))
        .pipe(IF(isBuild, groupCssMediaQueries()))
        .pipe(sass.sync({outputStyle: "compressed"}).on("error", sass.logError))
        .pipe(IF(!(isBuild), sourcemaps.write("./")))
        .pipe(size())
        .pipe(gulp.dest(paths.style.dest))
        .pipe(browserSync.stream());
}
