import gulp from "gulp";
import { handleError } from "../_helpers/handle_error.js";
import { paths } from "../_helpers/paths.js";

export const taskPublic = () => {
    return gulp.src(paths.public.src)
        .pipe(handleError('PUBLIC'))
        .pipe(gulp.dest(paths.public.dest))
}
