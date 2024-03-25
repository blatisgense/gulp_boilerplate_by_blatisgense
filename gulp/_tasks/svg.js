import gulp from "gulp";
import { paths } from "../_helpers/paths.js";
import { handleError } from "../_helpers/handle_error.js";
import size from "gulp-size";
import browserSync from "browser-sync";

export const taskSvg = () => {
  return gulp.src(paths.svg.src)
    .pipe(handleError('SVG'))
    .pipe(size())
    .pipe(gulp.dest(paths.svg.dest))
    .pipe(browserSync.stream())
}
