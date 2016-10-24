"use strict";

const gulp = require("gulp");
const debug = require("gulp-debug");
const tsc = require("gulp-typescript");
const tslint = require("gulp-tslint");
const sourcemaps = require("gulp-sourcemaps");
const mocha = require("gulp-mocha");
const git = require("gulp-git");
const bump = require("gulp-bump");
const filter = require("gulp-filter");
const zip = require('gulp-zip');
const install = require("gulp-install");
const flatten = require('gulp-flatten');
const del = require("del");
const mkdirp = require("mkdirp");
const s3 = require("vinyl-s3");
const shell = require('gulp-shell')

const tsProject = tsc.createProject("tsconfig.json");
let hasError = false;
const app_id = "ruuby-pa-api";

// remove all built files
gulp.task("clean", () => {
  const filesToClean = [
    "build/**/*.js",
    "build/**/*.js.map",
    "build/**/*.d.ts",
    "build/**/*.hbs",
    "dist/**/*",
    "dist-zip/**/*"
  ];

  return del(filesToClean);
});

// lint the typescript
gulp.task("ts-lint", ["clean"], () => {
  hasError = false;

  try {
    return gulp.src( [
        "src/**/*.ts",
      ] )
      .pipe( tslint() )
      .pipe( tslint.report("verbose") );
    }
    catch (e) {
      hasError = true;
      return;
    }
});

// Compile TypeScript and include references to library and app .d.ts files.
gulp.task("compile-ts", ["ts-lint", "clean"], (cb) => {
  if (hasError) {
    cb();
    return;
  }

  hasError = false;

  const tsResult = gulp
    .src( [
      "src/**/*.ts",
      "typings/index.d.ts"
    ] )
    .pipe( sourcemaps.init() )
    .pipe( tsc(tsProject) )
    .on("error", () => { hasError = true; });

  return tsResult.js
    .pipe( sourcemaps.write(".") )
    .pipe(
      gulp.dest( tsProject.options.outDir )
    );
});

// used to copy the slack and sms message templates
gulp.task("copy-message-templates", function() {
  gulp.src("./src/**/*.hbs")
    .pipe(gulp.dest("./build"));
});

gulp.task("tests", ["build"], (cb) => {
  if (hasError) {
    cb();
    return;
  }

  return gulp.src("build/test/**/*.js", {read: false})
    .pipe(mocha())
    .on("error", handleError);
});

gulp.task("make-dist", ["tests"], () => {
  mkdirp("./dist");

  return gulp.src(["./build/app/**/*", "./package.json"])
    .pipe(gulp.dest("./dist"));
});

gulp.task("archive", ["make-dist"], () => {
  mkdirp("./dist-zip");
  const p = require("./package.json");

  return gulp.src("./dist/**/*", {base: "./dist"})
    .pipe(zip(`${app_id}-${p.version}.zip`))
    .pipe(gulp.dest("./dist-zip"));
});

gulp.task("watch", ["build"], () => {
  gulp.watch([ "src/**/*.ts" ], ["build"]);
});

gulp.task("watch-tests", ["tests"], () => {
  gulp.watch([ "src/**/*.ts" ], ["tests"]);
});

gulp.task("build", ["copy-message-templates", "compile-ts"]);

gulp.task("default", ["build"]);

gulp.task("bundle-release", ["make-dist", "move-client-dist"]);

// This handler makes gulp not exit
function handleError(err) {
  console.log(err.toString());
  this.emit("end");
}
