import gulp from 'gulp';
import { taskClear } from "./_tasks/clear.js";
import { taskHtml } from "./_tasks/html.js";
import { taskServer } from "./_tasks/browser_sync.js";
import { taskPublic } from "./_tasks/public.js";
import { taskJavascript } from "./_tasks/javascript.js";
import { taskStyle } from "./_tasks/style.js";
import { taskMedia } from "./_tasks/media.js";
import { taskFont } from "./_tasks/fonts.js";
import { paths } from "./_helpers/paths.js";
import { taskSvg } from "./_tasks/svg.js";

const taskWatch = () => {
  gulp.watch(paths.html.src, taskHtml);
  gulp.watch(paths.html.components, taskHtml);
  gulp.watch(paths.javascript.src, taskJavascript);
  gulp.watch(paths.style.watch, taskStyle);
  gulp.watch(paths.public.src, taskPublic);
  gulp.watch(paths.svg.src, taskSvg);
  gulp.watch(paths.media.transform_webp, taskMedia);
  gulp.watch([
    paths.fonts.transform_ttf,
    paths.fonts.transform_woff2,
    paths.fonts.src
  ], taskFont);
}

const development = gulp.series(
  taskClear,
  taskPublic,
  taskMedia,
  taskSvg,
  taskFont,
  taskHtml,
  taskJavascript,
  taskStyle,
  gulp.parallel(
    taskServer,
    taskWatch
  )
);

const build = gulp.series(
  taskClear,
  taskPublic,
  taskMedia,
  taskSvg,
  taskFont,
  taskHtml,
  taskJavascript,
  taskStyle
);

gulp.task('default', development);
gulp.task('build', build);
gulp.task('media', taskMedia);
gulp.task('fonts', taskFont);
