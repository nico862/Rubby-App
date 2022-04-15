"use strict";

const gulp = require("gulp");
const tsc = require("gulp-typescript");
const tslint = require("gulp-tslint");
const mocha = require("gulp-mocha");
const shell = require('gulp-shell')
const del = require("del");

const tsProject = tsc.createProject("tsconfig.json");

// remove all built files
gulp.task("clean", () => {
  const filesToClean = [
    "build/**/*"
  ];

  return del(filesToClean);
});

// lint the typescript
gulp.task("ts-lint", () => {
  return gulp.src( [
      "ts/**/*.ts*"
    ] )
    .pipe( tslint({formatter: "verbose"}) )
    .pipe( tslint.report() );
});

// Compile TypeScript and include references to library and app .d.ts files.
gulp.task("compile-ts", ["ts-lint", "clean"], () => {
  const tsResult = tsProject.src()
    .pipe( tsProject() );

  return tsResult.js
    .pipe(
      gulp.dest( tsProject.options.outDir )
    );
});

gulp.task("test", ["compile-ts"], () => {
  return gulp.src("build/test/**/*.js", {read: false})
    .pipe(mocha())
    .on("error", handleError);
});

gulp.task("build:watch", ["compile-ts"], () => {
  gulp.watch([ "ts/**/*.ts*" ], ["compile-ts"]);
});

gulp.task("watch:tests", ["tests"], () => {
  gulp.watch([ "ts/**/*.ts*" ], ["tests"]);
});

gulp.task("dev", ["build:watch"], shell.task([
  "react-native run-ios"
]))

gulp.task("build", ["compile-ts"]);
gulp.task("default", ["build"]);
