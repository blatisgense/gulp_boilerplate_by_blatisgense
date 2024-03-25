# Gulp_boilerplate_by_Blatisgense
- **[About](#about)**
- **[NPM scripts](#npm-scripts)**
- **[Contacts](#contacts)**
## About
- **Components**: Pages stores within root directory, components for including within `components` folder. _Plugins_:<br>
Importing components: `gulp-file-include`.<br>
Replace `<img>` with `<picture>`: [gulp_img_transform_to_picture](https://www.npmjs.com/package/gulp_img_transform_to_picture) (plugin by myself).<br>
Compression: `gulp-htmlmin`.
- **Javascript**: Fully processed by `WebPack` + `Babel` and its plugins.
- **Styles**:
Support old browsers: `gulp-autoprefixer`.<br>
Grouping media queries: `gulp-group-css-media-queries`<br>
SASS support + compressing: `gulp-sass` + `sass`.
- **Assets**:
- - _Fonts_: Transforming to `woff2` from `otf` and `ttf`, creating `fonts.scss` file with `@font-face` for fonts automatically.
- - _Images_: Transforming to `avif` & `webp` using `sharp`.

Errors handled by `gulp-notify` & `gulp-plumber`.<br>
Dev server provided by `browser-sync`.<br>
For size stats used `gulp-size`.<br>
Optional operations available with `gulp-if`.<br>
Sourcemaps generated `gulp-sourcemaps`.
## NPM scripts
- `npm run gulp:start`: Start project without transforming media files and fonts, only copy.
- `npm run gulp:dev`: Start project in development mode, transform media files and fonts, including sourcemaps and not minify.
- `npm run gulp:build`: Build project with maximum optimizations, ready for production.
- `npm run gulp:media`: Transform media files only.
- `npm run gulp:fonts`: Transform fonts only.
## Contacts:
If you notice any bug, or you want to suggest an idea, please contact me.
- **[Telegram](https://t.me/Blatisgense)**: @Blatisgense (best way)
- **[Discord](https://discordapp.com/users/559703556295360512)**: blatisgense
- **[Email](mailto:lavr.marudenko@gmail.com)**: lavr.marudenko@gmail.com
