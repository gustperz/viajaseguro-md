/**
 *  Welcome to your gulpfile!
 *  The gulp tasks are splitted in several files in the gulp directory
 *  because putting all here was really too long
 */

'use strict';

var gulp = require('gulp');
var wrench = require('wrench');
var electron = require('gulp-electron');
var packageJson = require('./package.json');

/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */
wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file);
});


/**
 *  Default task clean temporaries directories and launch the
 *  main optimization build task
 */
gulp.task('default', ['clean'], function () {
  gulp.start('build');
});

gulp.task('electron', function() {

  gulp.src("")
      .pipe(electron({
        src: './src',
        packageJson: packageJson,
        release: './dist',
        cache: './cache',
        version: 'v1.4.1',
        packaging: true,
        token: 'abc123...',
        platforms: ['linux', 'linux-ia32', 'linux-x64'],
        platformResources: {
          darwin: {
            CFBundleDisplayName: packageJson.name,
            CFBundleIdentifier: packageJson.name,
            CFBundleName: packageJson.name,
            CFBundleVersion: packageJson.version,
            icon: 'gulp-electron.icns'
          },
          win: {
            "version-string": packageJson.version,
            "file-version": packageJson.version,
            "product-version": packageJson.version,
            "icon": 'gulp-electron.ico'
          }
        }
      }))
      .pipe(gulp.dest(""));
});
