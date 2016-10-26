"use strict";

const gulp = require("gulp");
const tsc = require("gulp-typescript");
const tslint = require("gulp-tslint");
const mocha = require("gulp-mocha");
const shell = require('gulp-shell')
const del = require("del");

const tsProject = tsc.createProject("tsconfig.json");
let hasError = false;

// remove all built files
gulp.task("clean", () => {
  const filesToClean = [
    "build/**/*.js",      // path to all JS files auto gen"d by editor
    "build/**/*.js.map",  // path to all sourcemap files auto gen"d by editor
    "build/**/*.d.ts",    // path to all JS files auto gen"d by editor
  ];

  return del(filesToClean);
});

// lint the typescript
gulp.task("ts-lint", () => {
  hasError = false;

  try {
    return gulp.src( [
        "src/**/*.tsx",
        "src/**/*.ts",
      ] )
      .pipe( tslint({
        formatter: "verbose"
      }) )
      .pipe( tslint.report() );
    }
    catch (e) {
      hasError = true;
      console.log(e);
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
      "src/**/*.tsx",
      "src/**/*.ts",
      "typings/index.d.ts",
    ] )
    .pipe( tsc(tsProject) )
    .on("error", () => { hasError = true; });

  return tsResult.js
    .pipe(
      gulp.dest( tsProject.options.outDir )
    );
});

gulp.task("tests", ["compile-ts"], (cb) => {
  if (hasError) {
    cb();
    return;
  }

  return gulp.src("build/test/**/*.js", {read: false})
    .pipe(mocha())
    .on("error", handleError);
});

gulp.task("watch", ["compile-ts"], () => {
  gulp.watch([ "src/**/*.ts*" ], ["compile-ts"]);
});

gulp.task("watch:tests", ["tests"], () => {
  gulp.watch([ "src/**/*.ts*" ], ["tests"]);
});

gulp.task("dev", ["watch"], shell.task([
  "react-native run-ios"
]))

gulp.task("default", ["compile-ts"]);

// This handler makes gulp not exit
function handleError(err) {
  console.log(err.toString());
  this.emit("end");
}
