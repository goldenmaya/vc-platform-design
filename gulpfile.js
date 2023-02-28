const { src, dest, watch, series, parallel } = require("gulp");
const browserSync = require('browser-sync');
const ejs  = require('gulp-ejs');
const sass = require("gulp-sass")(require("sass"));
const webp = require('gulp-webp');
const rename = require('gulp-rename');
const uglify = require("gulp-uglify");
const htmlMin = require('gulp-htmlmin');
const prettify = require('gulp-prettify');


const browserSyncFunc = () => {
  browserSync.init({
    notify: false,
    server: {
      baseDir: 'dist',
    },
    startPath: './index.html',
    reloadOnRestart: true,
  });
};

const browserReloadFunc = (done) => {
  browserSync.reload();
  done();
};


const compileEjs = () =>
  src(["src/ejs/**/*.ejs", '!' + "src/ejs/**/_*.ejs"])
    .pipe(ejs({}, { ext: '.html'}))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(
      htmlMin({
        removeComments: false,
        collapseWhitespace: false,
        collapseInlineTagWhitespace: false,
        preserveLineBreaks: false,
      })
    )
    .pipe(
      prettify({
        indent_with_tabs: true,
        indent_size: 2,
      })
    )


    .pipe(dest("dist"));

const watchEjsFiles = () => watch("src/ejs/**/*.ejs", series(compileEjs, browserReloadFunc));

const compileSass = () =>
  src("src/sass/main.sass")
    .pipe(
      sass({
        outputStyle: "expanded"
      })
    )
    .pipe(dest("dist/css"));

const watchSassFiles = () => watch("src/sass/**/*.sass", series(compileSass, browserReloadFunc));


const convertWebp = () =>
  src("src/images/**/*.{jpg,png}")
    .pipe(webp())
    .pipe(dest("dist/images"));

const convertOtherImages = () =>
  src("src/images/**/*.{gif,svg}")
    .pipe(dest("dist/images"));

const watchImagesFiles = () => watch("src/images/**/*.{jpg,png,gif,svg}", series(convertWebp, convertOtherImages, browserReloadFunc));


const compileJs = () =>
  src("src/js/**/*.js")
    .pipe(uglify())
    .pipe(dest("dist/js"));

const watchJsFiles = () => watch("src/js/**/*.js", series(compileJs, browserReloadFunc));

exports.default = series(
  compileEjs,
  compileSass,
  compileJs,
  convertWebp,
  convertOtherImages,
  parallel(watchEjsFiles, watchSassFiles, watchJsFiles, watchImagesFiles, browserSyncFunc));
