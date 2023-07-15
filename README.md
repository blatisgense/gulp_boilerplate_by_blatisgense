# Gulp_bundle_blatisgense
#### My dev.  Gulp bundle.
#
### After installing dependency's run these commands:
- `npm run dev`: Run Gulp in development mode (Not compress files, add sourcemaps).
###
- `npm run build`: Run Gulp in production mode (Compress files, group CSS media queries, use Autoprefixer).
###
- `npm run deployFTP`: Deploy files form *_build* to a server via FTP. (You should fill *configFTP* at *gulpfile.babel.js*).
###
- `npm run svgSprive`: Make-SVG sprite from your SVG. (To use this writes `<img src="path/to/sprite.svg#name_of_svg">`, you also can find there html file, with all your SVG's)
###
- `npm run fonts`: Transform only fonts (.otf to .ttf to woff2), and makes fonts.scss with: 
```scss
@font-face {
  font-family: fontname;
  font-display: swap;
  src: url("path/filename.woff2") format("woff2");
  font-weight: fontweight;
  font-style: fontstyle;
}
  ```
###
- `npm run prettier`: Use prettier for files in *_src* folder (for setup use *.prettierrc*).
## About plugins inside

- Autoprefixer (only build mode): make CSS cross browser and comparable with old versions, by adding vendor prefixes.
- SASS/SCSS: use SASS/SCSS and minify CSS.  
- Babel: support legacy browsers, give opportunity to use the newest methods.
- Terser: minify JS.
- Htmlmin: minify HTML files.
- File-include: module functionality in native HTML.
- Webpack: used for JS, give opportunity to use Imports and Exports for modules. If you need to make more than 1 file, add `entry` to *webpack.config.js*.
```javascript
entry: { name: `${paths.src}/JS/name.js`}
```
- Sharp library: transform images to modern formats like webp and avif, compress png and jpg images.
- Plugin for logging final size of items.
- Sourcemaps: with it you can see original file, before compile.
- Browser-sync: opening local server with hot-reload and many other features.
- Plugins and functions for fonts and make fonts.scss.
- My own plugin https://www.npmjs.com/package/gulp_img_transform_to_picture .

# Contacts: 
- Gmail: lavr.marudenko@gmail.com, 
- Skype and telegram @blatisgense.
