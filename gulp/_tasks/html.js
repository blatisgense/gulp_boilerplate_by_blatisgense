import gulp from "gulp";
import { paths } from "../_helpers/paths.js";
import { handleError } from "../_helpers/handle_error.js";
import { isBuild } from "../_helpers/if.js";
import fileinclude from "gulp-file-include";
import browserSync from "browser-sync";
import htmlmin from "gulp-htmlmin";
import size from "gulp-size";
import gulp_img_transform_to_picture from "gulp_img_transform_to_picture";

export const taskHtml = () => {
    return gulp.src(paths.html.src)
        .pipe(handleError('HTML'))
        .pipe(fileinclude({
            prefix: '@@',
        }))
        .pipe(gulp_img_transform_to_picture({
            quotes: "double",
            logger: true,
            display_contents: true
        }))
        .pipe(htmlmin({
            useShortDoctype: true,
            sortClassName: true,
            collapseWhitespace: isBuild,
            removeComments: isBuild
        }))
        .pipe(size())
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browserSync.stream());
}
