import gulp from "gulp";
import browserSync from "browser-sync";
import size from "gulp-size";
import sourcemaps from "gulp-sourcemaps";
import webpack from "webpack-stream";
import { paths } from "../_helpers/paths.js";
import { IF, isBuild } from "../_helpers/if.js";
import { handleError } from "../_helpers/handle_error.js";
import { webpack_config } from "../webpack.config.js";

export const taskJavascript = () => {
  return gulp.src(paths.javascript.src)
    .pipe(handleError('JAVASCRIPT'))
    .pipe(IF(!(isBuild), sourcemaps.init({ largeFile: true })))
    .pipe(webpack({ config: webpack_config(!(isBuild))}))
    .pipe(IF(!(isBuild), sourcemaps.write("./")))
    .pipe(size())
    .pipe(gulp.dest(paths.javascript.dest))
    .pipe(browserSync.stream());
}
