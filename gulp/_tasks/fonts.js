import fs from "fs";
import gulp from "gulp";
import ttf2woff2 from "gulp-ttf2woff2";
import fonter from "../node_modules/gulp-fonter-2/dist/index.js";
import { font_library } from "../_helpers/font_library.js";
import { paths } from "../_helpers/paths.js";
import { handleError } from "../_helpers/handle_error.js";
import size from "gulp-size";
import { argv } from "node:process";

const ttf = async () => {
  return gulp.src(paths.fonts.transform_ttf)
    .pipe(handleError('TTF'))
    .pipe(fonter({formats: ['ttf']}))
    .pipe(gulp.dest(paths.fonts.transform_to))
};


const woff2 = async () => {
  return gulp.src(paths.fonts.transform_woff2)
    .pipe(handleError('WOFF2'))
    .pipe(ttf2woff2())
    .pipe(gulp.dest(paths.fonts.transform_to))
}

const copy = async () => {
  return gulp.src(paths.fonts.src)
    .pipe(handleError('FONTS'))
    .pipe(size())
    .pipe(gulp.dest(paths.fonts.dest))
}

const fonts_sass = async () => {
  const scss = paths.fonts.scss;
  fs.readdir(paths.fonts.dir,{ recursive: true }, (_err, files) => {
    if (files) {
      let fonts = [];
      fs.writeFile(paths.fonts.scss, '', (err => err ? console.log(err) : null));
      files.map((file => file.split('.')[1] === 'woff2' ? fonts.push(file) : null ));
      fonts.map(font => {
        let path = font.split('.');
        path.pop();
        path = path.join('.');
        const name = path.split('-')[0];
        const data = path.split('-')[1].toLowerCase();
        if (font_library[data]){
          let weight = font_library[data].weight;
          let style = font_library[data].style;
          let template = "";
          template += `@font-face {\n\t`;
          template += `font-family: ${name};\n\t`;
          template += `font-display: swap;\n\t`;
          template += `src: url("../../fonts/${font}") format("${font.split('.')[1]}");\n\t`;
          template += `font-weight: ${weight};\n\t`;
          template += `font-style: ${style};\n`;
          template += `}\n`;
          fs.appendFile(scss, template, (err => err ? console.log(err) : null));
        } else console.log(`Cannot extract font data from "${font}", please contact maintainer.`);
      })
    } else console.log("No font files found.");
  })
}

export const taskFont = argv.includes("--fonts") ? gulp.series(ttf, woff2, fonts_sass, copy) : gulp.series(fonts_sass, copy);
