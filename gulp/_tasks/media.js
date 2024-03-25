import { argv } from 'node:process';
import gulp from "gulp";
import size from "gulp-size";
import { paths } from "../_helpers/paths.js";
import { handleError } from "../_helpers/handle_error.js";
import sharpResponsive from "gulp-sharp-responsive";
import browserSync from "browser-sync";

const avif = () => {
  return gulp.src(paths.media.transform_avif)
    .pipe(handleError('AVIF'))
    .pipe(sharpResponsive({
        formats: [
            { format: "webp", quality: 90},
            { format: "avif", quality: 90 },
        ]
    }))
    .pipe(gulp.dest(paths.media.transform_to))
}

const webp = () => {
  return gulp.src(paths.media.transform_webp)
    .pipe(handleError('WEBP'))
    .pipe(sharpResponsive({
        formats: [
            { format: "webp", quality: 90},
        ]
    }))
    .pipe(gulp.dest(paths.media.transform_to));
}

const copy = () => {
  return gulp.src(paths.media.src)
    .pipe(handleError('MEDIA'))
    .pipe(size())
    .pipe(gulp.dest(paths.media.dest))
}

export const taskMedia = (argv.includes("--sharp")) ? gulp.series(webp, avif, copy) : copy;
