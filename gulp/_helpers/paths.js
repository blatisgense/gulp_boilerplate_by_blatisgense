const buildPath = "../_build";
const srcPath = "../_src";

export const paths = {
  root: `${buildPath}/`,
  html: {
    src: `${srcPath}/*.html`,
    dest: `${buildPath}/`,
    components: `${srcPath}/components/*.html`
  },
  public: {
    src: `${srcPath}/public/**/*.*`,
    dest: `${buildPath}/public/`
  },
  javascript: {
    src: `${srcPath}/assets/javascript/**/*.js`,
    dest: `${buildPath}/assets/javascript/`
  },
  style: {
    src: [
      `${srcPath}/assets/styles/*.sass`,
      `${srcPath}/assets/styles/*.css`,
      `${srcPath}/assets/styles/*.scss`,
    ],
    watch: [
      `${srcPath}/assets/styles/**/*.sass`,
      `${srcPath}/assets/styles/**/*.css`,
      `${srcPath}/assets/styles/**/*.scss`,
    ],
    dest: `${buildPath}/assets/styles/`
  },
  media: {
    transform_avif: [
      `${srcPath}/assets/images/**/*.jpg`,
      `${srcPath}/assets/images/**/*.jpeg`,
    ],
    transform_webp: [
      `${srcPath}/assets/images/**/*.jpg`,
      `${srcPath}/assets/images/**/*.jpeg`,
      `${srcPath}/assets/images/**/*.png`,
    ],
    transform_to: `${srcPath}/assets/images/`,
    src: [
      `${srcPath}/assets/images/**/*.jpg`,
      `${srcPath}/assets/images/**/*.jpeg`,
      `${srcPath}/assets/images/**/*.png`,
      `${srcPath}/assets/images/**/*.webp`,
      `${srcPath}/assets/images/**/*.avif`,
    ],
    dest: `${buildPath}/assets/images/`
  },
  svg: {
    src: `${srcPath}/assets/svg/**/*.svg`,
    dest: `${buildPath}/assets/svg/`
  },
  fonts: {
    transform_ttf: `${srcPath}/assets/fonts/**/*.otf`,
    transform_woff2: `${srcPath}/assets/fonts/**/*.ttf`,
    transform_to: `${srcPath}/assets/fonts/`,
    dir: `${srcPath}/assets/fonts/`,
    scss: `${srcPath}/assets/styles/config/fonts.scss`,
    src: `${srcPath}/assets/fonts/**/*.woff2`,
    dest: `${buildPath}/assets/fonts/`
  }
};
