const gulp = require('gulp');
const babel = require('gulp-babel');
const path = require('path');
const del = require('del');

const config = {
  src: {
    js: ['./src/**/*.js', '!node_modules/**/*.js'],
    html: './src/**/*.html',
    css: './src/**/*.css',
    assets: ['./src/**/*.png', './src/**/*.jpg']
  },
  dest: './'
};

const sources = Object.keys(config.src).map(k => config.src[k]);

gulp.task('clean', () => del([
  'dist/**/*',
  'assets/**/*',
  '*.html'
]));

gulp.task('babel', ['clean'], () => {
  gulp.src(config.src.js)
  .pipe(babel())
  .pipe(gulp.dest(path.join(config.dest, 'dist')));
});

gulp.task('copy', ['clean'], () => {
  gulp.src(config.src.html)
  .pipe(gulp.dest(path.join(config.dest, 'dist')));
});

gulp.task('assets', ['clean'], () => {
  gulp.src(config.src.assets)
  .pipe(gulp.dest(path.join(config.dest, 'dist')));
});

gulp.task('css', ['clean'], () => {
  gulp.src(config.src.css)
  .pipe(gulp.dest(path.join(config.dest, 'dist')));
});

gulp.task('build', ['babel', 'copy', 'assets', 'css']);
gulp.task('default', ['build']);
